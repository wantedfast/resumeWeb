"""Update the original resume PDF without rebuilding its visual template."""

from __future__ import annotations

import io
import shutil
from pathlib import Path

import fitz
from PIL import Image, ImageDraw, ImageOps


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "output" / "pdf" / "Wang-Xinlong-Resume-Original.pdf"
FINAL = ROOT / "output" / "pdf" / "Wang-Xinlong-Resume-Original-Layout-Updated.pdf"
PUBLIC = ROOT / "public" / "Wang-Xinlong-Resume.pdf"
PORTRAIT = ROOT / "public" / "assets" / "wang-xinlong-suit-portrait.png"
TMP = ROOT / "tmp" / "pdfs" / "in-place"

ARIAL = Path(r"C:\Windows\Fonts\arial.ttf")
ARIAL_BOLD = Path(r"C:\Windows\Fonts\arialbd.ttf")

TEXT = (0.16, 0.16, 0.17)
MUTED = (0.38, 0.38, 0.40)
LINE = (0.82, 0.83, 0.84)

EMAIL = "mailto:wangfeichen@hotmail.com"
GITHUB = "https://github.com/wantedfast"
PAPER = "https://www.jstage.jst.go.jp/article/ijabc/2026/1/2026_144/_pdf/-char/en"
COVS = "https://github.com/wantedfast/COVS"
AZURE_IDENTITY = (
    "https://github.com/wantedfast/azure-sdk-for-net/tree/master/"
    "sdk/identity/Azure.Identity"
)
AZURE_SAMPLES = (
    "https://github.com/Azure-Samples/"
    "app-service-dotnet-access-key-vault-by-msi-for-web-apps"
)
CLOUD_PATTERNS = "https://github.com/mspnp/cloud-design-patterns"
TRADING = "https://github.com/wantedfast/AITradingHelper"
GANGKE = "https://github.com/wantedfast/gangke-zhihui"
GOODS = "https://github.com/wantedfast/goods-change"


def rect(x0: float, y0: float, x1: float, y1: float) -> fitz.Rect:
    return fitz.Rect(x0, y0, x1, y1)


def redact(page: fitz.Page, area: fitz.Rect) -> None:
    page.add_redact_annot(area, fill=(1, 1, 1), cross_out=False)


def insert_text(
    page: fitz.Page,
    point: tuple[float, float],
    text: str,
    *,
    fontname: str,
    fontsize: float,
    color=TEXT,
) -> None:
    page.insert_text(
        fitz.Point(*point),
        text,
        fontname=fontname,
        fontsize=fontsize,
        color=color,
        overlay=True,
    )


def insert_box(
    page: fitz.Page,
    area: fitz.Rect,
    text: str,
    *,
    fontname: str,
    fontsize: float,
    lineheight: float = 1.25,
    align: int = fitz.TEXT_ALIGN_LEFT,
    color=TEXT,
) -> None:
    result = page.insert_textbox(
        area,
        text,
        fontname=fontname,
        fontsize=fontsize,
        lineheight=lineheight,
        align=align,
        color=color,
        overlay=True,
    )
    if result < 0:
        raise RuntimeError(f"Text overflow ({result:.2f}) in {area}: {text!r}")


def add_uri(page: fitz.Page, area: fitz.Rect, uri: str) -> None:
    page.insert_link({"kind": fitz.LINK_URI, "from": area, "uri": uri})


def make_circle_portrait() -> bytes:
    """Crop the supplied suit portrait to a centered transparent circle."""
    image = Image.open(PORTRAIT).convert("RGBA")
    width, height = image.size
    side = min(width, height)
    # Keep the face centered while retaining enough suit in the circular crop.
    left = max(0, int((width - side) / 2))
    top = max(0, int((height - side) * 0.20))
    top = min(top, height - side)
    image = image.crop((left, top, left + side, top + side))
    image = ImageOps.fit(image, (900, 900), Image.Resampling.LANCZOS)
    mask = Image.new("L", image.size, 0)
    ImageDraw.Draw(mask).ellipse((1, 1, 898, 898), fill=255)
    image.putalpha(mask)
    stream = io.BytesIO()
    image.save(stream, format="PNG", optimize=True)
    return stream.getvalue()


def add_bullet(
    page: fitz.Page,
    y: float,
    text: str,
    *,
    fontname: str,
    size: float = 9.25,
    x: float = 37.5,
    right: float = 571.5,
    height: float = 25,
) -> fitz.Rect:
    insert_text(page, (25.5, y + 8.7), "•", fontname=fontname, fontsize=8.5)
    area = rect(x, y, right, y + height)
    insert_box(
        page,
        area,
        text,
        fontname=fontname,
        fontsize=size,
        lineheight=1.22,
    )
    return area


def page_one(page: fitz.Page, font_regular: str, font_bold: str) -> None:
    # Contact block.
    redact(page, rect(190, 174, 407, 213))

    # Professional summary and education rows.
    redact(page, rect(20, 255, 575, 331))
    redact(page, rect(20, 373, 575, 397))
    redact(page, rect(20, 412, 575, 436))
    redact(page, rect(20, 451, 575, 475))

    # Project and research copy.
    redact(page, rect(20, 545, 575, 621))
    redact(page, rect(20, 648, 125, 674))
    redact(page, rect(20, 674, 575, 786))

    page.apply_redactions(images=fitz.PDF_REDACT_IMAGE_NONE, graphics=0, text=0)
    page.insert_font(fontname=font_regular, fontfile=str(ARIAL))
    page.insert_font(fontname=font_bold, fontfile=str(ARIAL_BOLD))

    # New portrait over the original circular image, extending very slightly to
    # eliminate any fringe from the blue-background source portrait.
    page.insert_image(
        rect(256.9, 47.65, 338.6, 129.35),
        stream=make_circle_portrait(),
        keep_proportion=True,
        overlay=True,
    )

    insert_box(
        page,
        rect(150, 176, 446, 191),
        "wangfeichen@hotmail.com  |  github.com/wantedfast",
        fontname=font_regular,
        fontsize=8.6,
        align=fitz.TEXT_ALIGN_CENTER,
    )
    insert_box(
        page,
        rect(170, 194, 426, 209),
        "AI Engineer  |  Ph.D. Researcher",
        fontname=font_regular,
        fontsize=9.0,
        align=fitz.TEXT_ALIGN_CENTER,
    )
    add_uri(page, rect(200, 176, 294, 191), EMAIL)
    add_uri(page, rect(306, 176, 396, 191), GITHUB)

    summary = (
        "AI engineer and Ph.D. candidate in Computer Science at Doshisha University, "
        "researching Human-AI collaboration with world models. My current work focuses "
        "on how agents infer human cooperative intent from observed actions and interaction "
        "dynamics. I bring eight years of technical experience across software engineering, "
        "Azure SDK development, cloud authentication, enterprise IT, and independent AI systems."
    )
    insert_box(
        page,
        rect(24, 260, 571.5, 327),
        summary,
        fontname=font_regular,
        fontsize=9.15,
        lineheight=1.34,
    )

    # Education rows: retain the original grid and right-aligned dates.
    education = [
        (380.0, "Doshisha University", 24, 10.6, "Ph.D.", 159.2, "Computer Science", 200, "2023.09-Present"),
        (419.0, "Doshisha University", 24, 10.6, "M.Sc.", 159.2, "Computer Science", 200, "2021.09-2023.09"),
        (458.0, "Shanghai University of Engineering Science", 24, 9.2, "B.Sc.", 280, "Computer Science", 325, "2012.09-2016.07"),
    ]
    for y, school, sx, school_size, degree, dx, major, mx, date in education:
        insert_text(page, (sx, y + 9.2), school, fontname=font_bold, fontsize=school_size)
        insert_text(page, (dx, y + 9.2), degree, fontname=font_regular, fontsize=9.8)
        insert_text(page, (mx, y + 9.2), major, fontname=font_regular, fontsize=9.8)
        insert_box(
            page,
            rect(475, y, 571.5, y + 16),
            date,
            fontname=font_regular,
            fontsize=9.6,
            align=fitz.TEXT_ALIGN_RIGHT,
        )

    add_bullet(
        page,
        548,
        "Built an LLM-based job-search assistant for resume analysis, recruiter Q&A, and role-specific applications.",
        fontname=font_regular,
        height=25,
    )
    add_bullet(
        page,
        574,
        "Designed a multi-agent workflow for evidence-grounded outreach and output evaluation.",
        fontname=font_regular,
        height=18,
    )
    add_bullet(
        page,
        599,
        "Added recruiter-question answering grounded in verified resume information.",
        fontname=font_regular,
        height=18,
    )

    insert_text(page, (24, 665.4), "Ph.D. Research", fontname=font_bold, fontsize=12)
    research_1 = add_bullet(
        page,
        677,
        "Researching Human-AI collaboration with world models to infer cooperative intent from actions and interaction dynamics.",
        fontname=font_regular,
        height=27,
    )
    research_2 = add_bullet(
        page,
        713,
        "Designed COVS, a continuous-action Overcooked simulator for multi-agent coordination.",
        fontname=font_regular,
        height=19,
    )
    research_3 = add_bullet(
        page,
        744,
        "Published COVS in the International Journal of Activity and Behavior Computing (2026).",
        fontname=font_regular,
        height=22,
    )
    add_uri(page, research_2, COVS)
    add_uri(page, research_3, PAPER)


def page_two(page: fitz.Page, font_regular: str, font_bold: str) -> None:
    # Publication entry.
    redact(page, rect(20, 37, 575, 102))

    # Four employment entries.
    redact(page, rect(20, 143, 575, 240))
    redact(page, rect(20, 254, 575, 423))
    redact(page, rect(20, 437, 575, 516))
    redact(page, rect(20, 530, 575, 610))

    # Open source heading and copy, keeping the Project List section header.
    redact(page, rect(20, 653, 575, 806))
    page.apply_redactions(images=fitz.PDF_REDACT_IMAGE_NONE, graphics=0, text=0)
    page.insert_font(fontname=font_regular, fontfile=str(ARIAL))
    page.insert_font(fontname=font_bold, fontfile=str(ARIAL_BOLD))

    insert_text(
        page,
        (24, 54.2),
        "International Journal of Activity and Behavior Computing (2026)",
        fontname=font_bold,
        fontsize=11.4,
    )
    publication = (
        'Xinlong Wang, Kota Toyoda, Miho Ohsaki, and Kimiaki Shirahama. '
        '"A Continuous-Space Overcooked Simulator for Multi-Agent Coordination." '
        "Published in IJABC, 2026."
    )
    insert_box(
        page,
        rect(24, 65, 571.5, 98),
        publication,
        fontname=font_regular,
        fontsize=9.2,
        lineheight=1.28,
    )
    add_uri(page, rect(24, 40, 571.5, 98), PAPER)

    # Döhler Shanghai.
    insert_text(page, (24, 158.6), "Döhler Shanghai", fontname=font_bold, fontsize=12)
    insert_text(page, (139, 158.6), "IT Engineer, APAC", fontname=font_regular, fontsize=10)
    insert_box(
        page, rect(470, 146, 571.5, 164), "2017.01-2018.05",
        fontname=font_regular, fontsize=9.6, align=fitz.TEXT_ALIGN_RIGHT,
    )
    add_bullet(
        page, 170,
        "Maintained regional workplace infrastructure and supported SAP and QAD business-system workflows.",
        fontname=font_regular, height=26,
    )
    add_bullet(
        page, 196,
        "Resolved incidents and service requests for APAC users under established SLA requirements.",
        fontname=font_regular, height=21,
    )
    add_bullet(
        page, 220,
        "Coordinated system maintenance and upgrades with regional and international technical teams.",
        fontname=font_regular, height=20,
    )

    # Wicresoft / Azure SDK.
    insert_text(
        page, (24, 269.6), "Shanghai Wicresoft", fontname=font_bold, fontsize=12
    )
    insert_text(
        page, (153, 269.6), "Software Engineer, Azure SDK",
        fontname=font_regular, fontsize=10,
    )
    insert_box(
        page, rect(470, 257, 571.5, 275), "2018.05-2020.07",
        fontname=font_regular, fontsize=9.6, align=fitz.TEXT_ALIGN_RIGHT,
    )
    add_bullet(
        page, 281,
        "Developed C# functionality for Azure Identity and Key Vault libraries in the Azure SDK for .NET.",
        fontname=font_regular, height=25,
    )
    add_bullet(
        page, 309,
        "Worked with the U.S.-based Azure engineering team on mock tests, end-to-end tests, and issue resolution.",
        fontname=font_regular, height=25,
    )
    add_bullet(
        page, 337,
        "Created samples and developer documentation for authentication and service-integration scenarios.",
        fontname=font_regular, height=25,
    )
    add_bullet(
        page, 365,
        "Contributed through GitHub issues and code review across locations and time zones.",
        fontname=font_regular, height=20,
    )
    add_bullet(
        page, 392,
        "Verified SDK behavior with mock and end-to-end tests aligned with GA quality expectations.",
        fontname=font_regular, height=24,
    )

    # Career transition.
    insert_text(
        page, (24, 452.6), "Career Transition & Independent Study",
        fontname=font_bold, fontsize=11.5,
    )
    insert_box(
        page, rect(470, 440, 571.5, 458), "2020.07-2021.09",
        fontname=font_regular, fontsize=9.6, align=fitz.TEXT_ALIGN_RIGHT,
    )
    add_bullet(
        page, 465,
        "Returned home during COVID-19 to support family while continuing structured computer science study.",
        fontname=font_regular, height=25,
    )
    add_bullet(
        page, 491,
        "Prepared for graduate school and the transition from production engineering into AI research.",
        fontname=font_regular, height=20,
    )

    # Dow Chemical.
    insert_text(
        page, (24, 545.6), "Dow Chemical", fontname=font_bold, fontsize=12
    )
    insert_text(
        page, (110, 545.6), "IT Infrastructure Intern",
        fontname=font_regular, fontsize=10,
    )
    insert_box(
        page, rect(470, 533, 571.5, 551), "2015.07-2015.10",
        fontname=font_regular, fontsize=9.6, align=fitz.TEXT_ALIGN_RIGHT,
    )
    add_bullet(
        page, 558,
        "Supported enterprise IT infrastructure, end-user systems, and incident resolution.",
        fontname=font_regular, height=20,
    )
    add_bullet(
        page, 584,
        "Documented recurring issues and coordinated resolutions with internal support teams.",
        fontname=font_regular, height=20,
    )

    insert_text(
        page, (24, 669.6), "Open Source Contribution",
        fontname=font_bold, fontsize=12,
    )
    azure_title = add_bullet(
        page, 681,
        "Microsoft Azure SDK for .NET Contributor",
        fontname=font_bold, size=9.5, height=18,
    )
    add_bullet(
        page, 705,
        "Implemented C# authentication functionality for Azure Identity and Key Vault.",
        fontname=font_regular, height=19,
    )
    add_bullet(
        page, 729,
        "Added mock tests and end-to-end tests for SDK behavior and GA quality.",
        fontname=font_regular, height=19,
    )
    add_bullet(
        page, 753,
        "Created samples and README documentation; resolved issues through public GitHub collaboration.",
        fontname=font_regular, height=25,
    )
    add_bullet(
        page, 783,
        "Contributions were merged into Microsoft repositories; Arctic Code Vault Contributor.",
        fontname=font_regular, height=20,
    )
    add_uri(page, azure_title, AZURE_IDENTITY)


def page_three(page: fitz.Page, font_regular: str, font_bold: str) -> None:
    # Skills, section spelling, and awards.
    redact(page, rect(28, 155, 575, 214))
    redact(page, rect(20, 228, 126, 258))
    redact(page, rect(20, 263, 575, 340))
    page.apply_redactions(images=fitz.PDF_REDACT_IMAGE_NONE, graphics=0, text=0)
    page.insert_font(fontname=font_regular, fontfile=str(ARIAL))
    page.insert_font(fontname=font_bold, fontfile=str(ARIAL_BOLD))

    # Existing visible URLs receive clickable annotations.
    add_uri(page, rect(24, 16, 486, 32), AZURE_IDENTITY)
    add_uri(page, rect(24, 34, 513, 50), AZURE_SAMPLES)
    add_uri(page, rect(24, 52, 372, 68), CLOUD_PATTERNS)

    skills = [
        "C#, Python, .NET",
        "LLM agents, multi-agent systems, world models",
        "Azure SDK, Azure Identity, Linux, Windows, networking",
    ]
    for y, value in zip((167, 185, 203), skills):
        insert_text(page, (33, y), value, fontname=font_regular, fontsize=9.8)

    insert_text(page, (24, 249.6), "Prize & Honor", fontname=font_bold, fontsize=15)
    awards = [
        "JASSO Scholarship",
        "Doshisha University Scholarship (S Level)",
        "Outstanding Leader of Co-Learning Program",
        "Outstanding Undergraduate Paper",
    ]
    for y, value in zip((267, 286, 305, 324), awards):
        add_bullet(
            page, y,
            value,
            fontname=font_regular,
            height=17,
            x=46.5,
        )

    # New content occupies only the previously blank lower half of page three.
    insert_text(page, (24, 383.5), "Additional Projects", fontname=font_bold, fontsize=15)
    page.draw_line(
        fitz.Point(153, 378.5),
        fitz.Point(571.5, 378.5),
        color=LINE,
        width=0.65,
        overlay=True,
    )

    projects = [
        (
            414,
            "AI Trading Helper",
            "ACTIVE PROTOTYPE",
            "A local-first tool that turns trading screenshots and files into structured facts, "
            "review notes, observation plans, and reminders. It does not provide investment advice.",
            TRADING,
        ),
        (
            507,
            "Gangke Zhihui",
            "VOCATIONAL EDUCATION MVP",
            "A teacher-in-the-loop workflow for assignments, rubrics, student submissions, "
            "AI-assisted scoring, review, and skills dashboards.",
            GANGKE,
        ),
        (
            600,
            "Goods Change",
            "CLOSED-TEST BUILD",
            "A campus community app for free item exchange, pickup requests, private chat, "
            "and in-person handoff, without payment or delivery features.",
            GOODS,
        ),
    ]
    for y, title, status, description, uri in projects:
        insert_text(page, (24, y), title, fontname=font_bold, fontsize=12)
        insert_box(
            page,
            rect(410, y - 12, 571.5, y + 3),
            status,
            fontname=font_regular,
            fontsize=8.3,
            align=fitz.TEXT_ALIGN_RIGHT,
            color=MUTED,
        )
        description_area = rect(24, y + 13, 571.5, y + 48)
        insert_box(
            page,
            description_area,
            description,
            fontname=font_regular,
            fontsize=9.25,
            lineheight=1.28,
        )
        add_uri(page, rect(24, y - 14, 210, y + 5), uri)
        page.draw_line(
            fitz.Point(24, y + 62),
            fitz.Point(571.5, y + 62),
            color=LINE,
            width=0.5,
            overlay=True,
        )


def main() -> None:
    if not SOURCE.exists():
        raise FileNotFoundError(SOURCE)
    if not PORTRAIT.exists():
        raise FileNotFoundError(PORTRAIT)
    if not ARIAL.exists() or not ARIAL_BOLD.exists():
        raise FileNotFoundError("Arial font files were not found in C:\\Windows\\Fonts")

    TMP.mkdir(parents=True, exist_ok=True)
    FINAL.parent.mkdir(parents=True, exist_ok=True)
    PUBLIC.parent.mkdir(parents=True, exist_ok=True)

    doc = fitz.open(SOURCE)
    if len(doc) != 3:
        raise RuntimeError(f"Expected 3 pages, found {len(doc)}")
    for page in doc:
        if abs(page.rect.width - 595.92) > 0.02 or abs(page.rect.height - 841.92) > 0.02:
            raise RuntimeError(f"Unexpected page size: {page.rect}")

    regular_names: list[str] = []
    bold_names: list[str] = []
    for page in doc:
        page.insert_font(fontname="ResumeArial", fontfile=str(ARIAL))
        page.insert_font(fontname="ResumeArialBold", fontfile=str(ARIAL_BOLD))
        regular_names.append("ResumeArial")
        bold_names.append("ResumeArialBold")

    page_one(doc[0], regular_names[0], bold_names[0])
    page_two(doc[1], regular_names[1], bold_names[1])
    page_three(doc[2], regular_names[2], bold_names[2])

    metadata = doc.metadata.copy()
    metadata["title"] = "Wang Xinlong Resume"
    metadata["subject"] = "AI engineering, Human-AI collaboration, and selected projects"
    metadata["keywords"] = (
        "AI engineer, Human-AI collaboration, world models, Azure SDK, "
        "multi-agent systems"
    )
    doc.set_metadata(metadata)

    temp_output = TMP / "resume-updated.pdf"
    doc.save(temp_output, garbage=4, deflate=True, clean=False)
    doc.close()

    shutil.copy2(temp_output, FINAL)
    shutil.copy2(temp_output, PUBLIC)
    print(FINAL)
    print(PUBLIC)


if __name__ == "__main__":
    main()
