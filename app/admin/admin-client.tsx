"use client";

import { ArrowLeft, Check, Plus, Save, Trash2 } from "lucide-react";
import { useState } from "react";
import type { JourneyItem, Project, SiteProfile } from "../profile";

type SaveState = "idle" | "saving" | "saved" | "error";

const blankProject: Project = {
  id: "new-project",
  year: "2026",
  title: { zh: "新项目", en: "New project" },
  type: { zh: "项目类型", en: "Project type" },
  summary: { zh: "", en: "" },
  detail: { zh: "", en: "" },
  tags: [],
  image: "/assets/kivo-redo/prism-agent.png",
};

const blankJourney: JourneyItem = {
  period: "2026",
  role: { zh: "新经历", en: "New experience" },
  organization: { zh: "", en: "" },
  note: { zh: "", en: "" },
};

function Field({
  label,
  value,
  onChange,
  multiline = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
}) {
  return (
    <label className={multiline ? "admin-field wide" : "admin-field"}>
      <span>{label}</span>
      {multiline ? (
        <textarea value={value} onChange={(event) => onChange(event.target.value)} rows={4} />
      ) : (
        <input value={value} onChange={(event) => onChange(event.target.value)} />
      )}
    </label>
  );
}

export default function AdminClient({
  initialProfile,
  userEmail,
}: {
  initialProfile: SiteProfile;
  userEmail: string;
}) {
  const [profile, setProfile] = useState(initialProfile);
  const [saveState, setSaveState] = useState<SaveState>("idle");

  function updateProject(index: number, next: Project) {
    setProfile((current) => ({
      ...current,
      projects: current.projects.map((item, itemIndex) => itemIndex === index ? next : item),
    }));
  }

  function updateJourney(index: number, next: JourneyItem) {
    setProfile((current) => ({
      ...current,
      journey: current.journey.map((item, itemIndex) => itemIndex === index ? next : item),
    }));
  }

  async function save() {
    setSaveState("saving");
    try {
      const response = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile }),
      });
      if (!response.ok) throw new Error("Save failed");
      setSaveState("saved");
      window.setTimeout(() => setSaveState("idle"), 2200);
    } catch {
      setSaveState("error");
    }
  }

  return (
    <main className="admin-shell">
      <header className="admin-header">
        <div>
          <p>PRIVATE CONTENT STUDIO</p>
          <h1>管理数字人资料</h1>
          <span>登录账户：{userEmail}</span>
        </div>
        <div className="admin-header-actions">
          <a href="/"><ArrowLeft size={17} />查看网站</a>
          <button type="button" onClick={() => void save()} disabled={saveState === "saving"}>
            {saveState === "saved" ? <Check size={17} /> : <Save size={17} />}
            {saveState === "saving" ? "保存中…" : saveState === "saved" ? "已保存" : saveState === "error" ? "保存失败，重试" : "保存并更新数字人"}
          </button>
        </div>
      </header>

      <div className="admin-grid">
        <section className="admin-section">
          <div className="admin-section-title"><span>01</span><h2>身份与介绍</h2></div>
          <div className="admin-form-grid">
            <Field label="姓名" value={profile.displayName} onChange={(displayName) => setProfile({ ...profile, displayName })} />
            <Field label="邮箱" value={profile.email} onChange={(email) => setProfile({ ...profile, email })} />
            <Field label="中文定位" value={profile.role.zh} onChange={(value) => setProfile({ ...profile, role: { ...profile.role, zh: value } })} />
            <Field label="English role" value={profile.role.en} onChange={(value) => setProfile({ ...profile, role: { ...profile.role, en: value } })} />
            <Field multiline label="中文职业摘要" value={profile.summary.zh} onChange={(value) => setProfile({ ...profile, summary: { ...profile.summary, zh: value } })} />
            <Field multiline label="English summary" value={profile.summary.en} onChange={(value) => setProfile({ ...profile, summary: { ...profile.summary, en: value } })} />
            <Field multiline label="中文 About" value={profile.about.zh} onChange={(value) => setProfile({ ...profile, about: { ...profile.about, zh: value } })} />
            <Field multiline label="English About" value={profile.about.en} onChange={(value) => setProfile({ ...profile, about: { ...profile.about, en: value } })} />
          </div>
        </section>

        <section className="admin-section">
          <div className="admin-section-title">
            <span>02</span><h2>项目</h2>
            <button type="button" onClick={() => setProfile({ ...profile, projects: [...profile.projects, { ...blankProject, id: `project-${Date.now()}` }] })}>
              <Plus size={16} />添加项目
            </button>
          </div>
          <div className="admin-card-list">
            {profile.projects.map((project, index) => (
              <article className="admin-card" key={project.id}>
                <div className="admin-card-head">
                  <strong>项目 {String(index + 1).padStart(2, "0")}</strong>
                  <button type="button" className="danger" onClick={() => setProfile({ ...profile, projects: profile.projects.filter((_, itemIndex) => itemIndex !== index) })}>
                    <Trash2 size={15} />删除
                  </button>
                </div>
                <div className="admin-form-grid">
                  <Field label="年份" value={project.year} onChange={(year) => updateProject(index, { ...project, year })} />
                  <Field label="ID" value={project.id} onChange={(id) => updateProject(index, { ...project, id })} />
                  <Field label="中文标题" value={project.title.zh} onChange={(value) => updateProject(index, { ...project, title: { ...project.title, zh: value } })} />
                  <Field label="English title" value={project.title.en} onChange={(value) => updateProject(index, { ...project, title: { ...project.title, en: value } })} />
                  <Field label="中文类型" value={project.type.zh} onChange={(value) => updateProject(index, { ...project, type: { ...project.type, zh: value } })} />
                  <Field label="English type" value={project.type.en} onChange={(value) => updateProject(index, { ...project, type: { ...project.type, en: value } })} />
                  <Field multiline label="中文摘要" value={project.summary.zh} onChange={(value) => updateProject(index, { ...project, summary: { ...project.summary, zh: value } })} />
                  <Field multiline label="English summary" value={project.summary.en} onChange={(value) => updateProject(index, { ...project, summary: { ...project.summary, en: value } })} />
                  <Field multiline label="中文详情" value={project.detail.zh} onChange={(value) => updateProject(index, { ...project, detail: { ...project.detail, zh: value } })} />
                  <Field multiline label="English detail" value={project.detail.en} onChange={(value) => updateProject(index, { ...project, detail: { ...project.detail, en: value } })} />
                  <Field label="标签（逗号分隔）" value={project.tags.join(", ")} onChange={(value) => updateProject(index, { ...project, tags: value.split(",").map((tag) => tag.trim()).filter(Boolean) })} />
                  <Field label="图片路径" value={project.image} onChange={(image) => updateProject(index, { ...project, image })} />
                  <Field label="项目链接（可选）" value={project.link ?? ""} onChange={(link) => updateProject(index, { ...project, link })} />
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="admin-section">
          <div className="admin-section-title">
            <span>03</span><h2>经历</h2>
            <button type="button" onClick={() => setProfile({ ...profile, journey: [...profile.journey, { ...blankJourney, role: { ...blankJourney.role }, organization: { ...blankJourney.organization }, note: { ...blankJourney.note } }] })}>
              <Plus size={16} />添加经历
            </button>
          </div>
          <div className="admin-card-list">
            {profile.journey.map((item, index) => (
              <article className="admin-card compact-card" key={`${item.period}-${index}`}>
                <div className="admin-card-head">
                  <strong>经历 {String(index + 1).padStart(2, "0")}</strong>
                  <button type="button" className="danger" onClick={() => setProfile({ ...profile, journey: profile.journey.filter((_, itemIndex) => itemIndex !== index) })}>
                    <Trash2 size={15} />删除
                  </button>
                </div>
                <div className="admin-form-grid">
                  <Field label="时间" value={item.period} onChange={(period) => updateJourney(index, { ...item, period })} />
                  <Field label="中文职位" value={item.role.zh} onChange={(value) => updateJourney(index, { ...item, role: { ...item.role, zh: value } })} />
                  <Field label="English role" value={item.role.en} onChange={(value) => updateJourney(index, { ...item, role: { ...item.role, en: value } })} />
                  <Field label="中文组织" value={item.organization.zh} onChange={(value) => updateJourney(index, { ...item, organization: { ...item.organization, zh: value } })} />
                  <Field label="English organization" value={item.organization.en} onChange={(value) => updateJourney(index, { ...item, organization: { ...item.organization, en: value } })} />
                  <Field multiline label="中文说明" value={item.note.zh} onChange={(value) => updateJourney(index, { ...item, note: { ...item.note, zh: value } })} />
                  <Field multiline label="English note" value={item.note.en} onChange={(value) => updateJourney(index, { ...item, note: { ...item.note, en: value } })} />
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="admin-section">
          <div className="admin-section-title"><span>04</span><h2>数字人性格与知识边界</h2></div>
          <p className="admin-help">这里的内容会进入 AI 系统提示词。工作风格与兴趣应保持为“对话观察”，不要写成无法验证的履历。</p>
          <div className="admin-form-grid">
            <Field multiline label="中文工作风格" value={profile.persona.workingStyle.zh} onChange={(value) => setProfile({ ...profile, persona: { ...profile.persona, workingStyle: { ...profile.persona.workingStyle, zh: value } } })} />
            <Field multiline label="English working style" value={profile.persona.workingStyle.en} onChange={(value) => setProfile({ ...profile, persona: { ...profile.persona, workingStyle: { ...profile.persona.workingStyle, en: value } } })} />
            <Field multiline label="中文兴趣" value={profile.persona.interests.zh} onChange={(value) => setProfile({ ...profile, persona: { ...profile.persona, interests: { ...profile.persona.interests, zh: value } } })} />
            <Field multiline label="English interests" value={profile.persona.interests.en} onChange={(value) => setProfile({ ...profile, persona: { ...profile.persona, interests: { ...profile.persona.interests, en: value } } })} />
            <Field multiline label="中文回答风格" value={profile.persona.responseStyle.zh} onChange={(value) => setProfile({ ...profile, persona: { ...profile.persona, responseStyle: { ...profile.persona.responseStyle, zh: value } } })} />
            <Field multiline label="English response style" value={profile.persona.responseStyle.en} onChange={(value) => setProfile({ ...profile, persona: { ...profile.persona, responseStyle: { ...profile.persona.responseStyle, en: value } } })} />
          </div>
        </section>
      </div>
    </main>
  );
}
