#!/usr/bin/env python
"""Generate public/resume.pdf from content/profile.json.

Why this exists: the site's "简历" button links to /resume.pdf. Keeping the
résumé generated from the single source of truth means it can never drift out
of sync with the page — edit profile.json, re-run, done.

Usage:
    python scripts/gen-resume.py            # writes public/resume.pdf
    python scripts/gen-resume.py -o out.pdf

Requires: reportlab (pip install reportlab)
If you'd rather ship a hand-designed PDF, just drop your own file at
public/resume.pdf — it will simply be served as a static asset.
"""

from __future__ import annotations

import argparse
import json
import pathlib
import sys

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.cidfonts import UnicodeCIDFont
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    KeepTogether,
    ListFlowable,
    ListItem,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
)

ROOT = pathlib.Path(__file__).resolve().parent.parent
PROFILE = ROOT / "content" / "profile.json"

INK = colors.HexColor("#14181F")
MUTED = colors.HexColor("#5A6472")
ACCENT = colors.HexColor("#2163CA")
RULE = colors.HexColor("#D8DDE5")


# Preferred CJK faces, first hit wins. Embedding a real TrueType keeps the PDF
# self-contained (the Adobe CID fonts are only referenced, so some viewers
# render Chinese as blanks without the matching system font).
CJK_CANDIDATES = [
    ("C:/Windows/Fonts/simhei.ttf", 0),  # 黑体 — clean, resume-friendly
    ("C:/Windows/Fonts/msyh.ttc", 0),  # 微软雅黑
    ("/System/Library/Fonts/PingFang.ttc", 0),
    ("/usr/share/fonts/truetype/noto/NotoSansCJK-Regular.ttc", 0),
]


def register_cjk() -> str:
    """Register and return a font name that can render Chinese."""
    for path, index in CJK_CANDIDATES:
        if not pathlib.Path(path).exists():
            continue
        try:
            pdfmetrics.registerFont(TTFont("CJK", path, subfontIndex=index))
            pdfmetrics.registerFontFamily("CJK", normal="CJK", bold="CJK", italic="CJK")
            return "CJK"
        except Exception as exc:  # pragma: no cover - environment dependent
            print(f"warning: could not load {path}: {exc}", file=sys.stderr)

    try:
        pdfmetrics.registerFont(UnicodeCIDFont("STSong-Light"))
        print("warning: no embeddable CJK font; using referenced STSong-Light", file=sys.stderr)
        return "STSong-Light"
    except Exception:  # pragma: no cover
        print("warning: no CJK font available; Chinese may not render", file=sys.stderr)
        return "Helvetica"


def styles(cjk: str):
    base = dict(fontName=cjk, fontSize=10.5, leading=15, textColor=INK)
    return {
        "name": ParagraphStyle("name", fontName=cjk, fontSize=24, leading=28, textColor=INK),
        "title": ParagraphStyle(
            "title", fontName=cjk, fontSize=11.5, leading=16, textColor=ACCENT, spaceBefore=2
        ),
        "contact": ParagraphStyle(
            "contact", fontName=cjk, fontSize=9.5, leading=14, textColor=MUTED
        ),
        "h2": ParagraphStyle(
            "h2",
            fontName=cjk,
            fontSize=11,
            leading=15,
            textColor=INK,
            spaceBefore=12,
            spaceAfter=5,
        ),
        "body": ParagraphStyle("body", **base, alignment=TA_LEFT, spaceAfter=4),
        "role": ParagraphStyle(
            "role", fontName=cjk, fontSize=10.5, leading=14.5, textColor=INK, spaceAfter=2
        ),
        "meta": ParagraphStyle(
            "meta", fontName=cjk, fontSize=9, leading=13, textColor=MUTED, spaceAfter=4
        ),
        "bullet": ParagraphStyle("bullet", fontName=cjk, fontSize=9.8, leading=14, textColor=INK),
        "chip": ParagraphStyle("chip", fontName=cjk, fontSize=9, leading=13, textColor=MUTED),
    }


def rule(width_mm: float = 170):
    from reportlab.platypus import HRFlowable

    return HRFlowable(
        width=width_mm * mm,
        thickness=0.6,
        color=RULE,
        spaceBefore=2,
        spaceAfter=8,
        hAlign="LEFT",
    )


def bullets(items, st, cjk: str):
    return ListFlowable(
        [
            ListItem(
                Paragraph(
                    f"<b>{b.get('metric', '')}</b> — {b.get('text', '')}"
                    if b.get("metric")
                    else b.get("text", ""),
                    st["bullet"],
                ),
                leftIndent=10,
                value="bulletchar",
            )
            for b in items
        ],
        bulletType="bullet",
        bulletFontName=cjk,
        bulletFontSize=7,
        leftIndent=10,
        bulletOffsetY=-1,
    )


def build(profile: dict, out: pathlib.Path) -> None:
    cjk = register_cjk()
    st = styles(cjk)
    ident = profile["identity"]
    links = ident.get("links", {})

    doc = SimpleDocTemplate(
        str(out),
        pagesize=A4,
        leftMargin=20 * mm,
        rightMargin=20 * mm,
        topMargin=18 * mm,
        bottomMargin=16 * mm,
        title=f"{ident['name']} — {ident['title']}",
        author=ident["name"],
        subject="Résumé",
    )

    contact = " · ".join(
        p for p in [links.get("email", ""), ident.get("location", ""), links.get("website", "")]
        if p
    )

    story: list = [
        Paragraph(ident["name"], st["name"]),
        Paragraph(ident["title"], st["title"]),
        Spacer(1, 5),
        Paragraph(contact, st["contact"]),
        rule(),
    ]

    if ident.get("heroSummary"):
        story += [Paragraph(ident["heroSummary"], st["body"])]

    # Experience
    story += [Paragraph("工作经历", st["h2"]), rule()]
    for company in profile.get("experience", []):
        block = [
            Paragraph(
                f"<b>{company.get('company', '')}</b>"
                + (f" · {company['location']}" if company.get("location") else ""),
                st["role"],
            ),
            Paragraph(
                " · ".join(
                    p
                    for p in [company.get("dates", ""), company.get("roles", [{}])[0].get("title", "")]
                    if p
                ),
                st["meta"],
            ),
        ]
        for role in company.get("roles", []):
            if role.get("summary"):
                block.append(Paragraph(role["summary"], st["body"]))
            if role.get("bullets"):
                block.append(bullets(role["bullets"], st, cjk))
        block.append(Spacer(1, 6))
        story.append(KeepTogether(block))

    # Projects
    if profile.get("projects"):
        story += [Paragraph("项目", st["h2"]), rule()]
        for p in profile["projects"]:
            links_txt = " · ".join(l["href"] for l in p.get("links", []))
            block = [
                Paragraph(
                    f"<b>{p['name']}</b>"
                    + (f" · {p['year']}" if p.get("year") else "")
                    + (f" · {p['role']}" if p.get("role") else ""),
                    st["role"],
                ),
                Paragraph(p.get("blurb", ""), st["body"]),
            ]
            if p.get("tags"):
                block.append(Paragraph("技术栈：" + " / ".join(p["tags"]), st["chip"]))
            if links_txt:
                block.append(Paragraph(links_txt, st["chip"]))
            block.append(Spacer(1, 6))
            story.append(KeepTogether(block))

    # Skills
    skills = profile.get("skills", {})
    if skills:
        story += [Paragraph("技能", st["h2"]), rule()]
        for group, items in skills.items():
            story.append(Paragraph(f"<b>{group}</b>：{' · '.join(items)}", st["body"]))

    # Expertise / open to
    for label, key in (("专长领域", "areasOfExpertise"), ("开放机会", "openTo")):
        values = profile.get("identity", {}).get(key) or profile.get(key)
        if values:
            story += [Paragraph(label, st["h2"]), rule()]
            story.append(Paragraph(" · ".join(values), st["body"]))

    doc.build(story)


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("-o", "--out", default=str(ROOT / "public" / "resume.pdf"))
    ap.add_argument("--profile", default=str(PROFILE))
    args = ap.parse_args()

    profile = json.loads(pathlib.Path(args.profile).read_text(encoding="utf-8"))
    out = pathlib.Path(args.out)
    out.parent.mkdir(parents=True, exist_ok=True)
    build(profile, out)
    print(f"wrote {out} ({out.stat().st_size / 1024:.0f} KB)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
