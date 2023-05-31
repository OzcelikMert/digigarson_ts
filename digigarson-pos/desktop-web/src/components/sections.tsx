import { useTranslation } from 'react-i18next';
import '../styles/tables.css'

export default function Sections({ section, sections, setSection }: { section:any, sections:any, setSection:(id:any)=>void }) {
    const Section = (sectionName: string, sectionId: any) => {
        return (
            <article
                style={{
                    backgroundColor:
                        section === sectionId ? "green" : "#EC3C33"
                }}
                onClick={() => setSection(sectionId)}>
                <span>{sectionName}</span>
            </article>
        )
    }
    const { t, i18n } = useTranslation();
    return (
        <main className="sections">
            <section >
                <article
                    style={{
                        backgroundColor:
                            section === "all" ? "green" : "#EC3C33"
                    }}
                    onClick={() => setSection("all")}
                >
                    {t("all")}
                </article>
                {sections && sections.map((section: { title: string; _id: any; }) => Section(section.title, section._id))}
            </section>
        </main>
    )
}
