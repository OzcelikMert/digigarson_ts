import {PagePropCommonDocument} from "modules/views/pages/pageProps";
import {Component, DetailedHTMLProps, HTMLAttributes} from "react";
import "../../../assets/app/styles/tables.css";

type PageProps = {
    isSelected: boolean;
    sectionName: string,
    onClick: any
} & PagePropCommonDocument & DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;

type PageState = {};

class Section extends Component<PageProps, PageState> {
    constructor(props: any) {
        super(props);
    }

    render() {
        return (
            <main className="sections">
                <section>
                    <article
                        style={{
                            backgroundColor: this.props.isSelected ? "green" : "#EC3C33",
                            cursor: "pointer",
                            margin: "0px 10px 15px 10px", borderRadius: "10px", 
                            padding: "20px"
                        }}
                        {...this.props}
                    >
                        <span>{this.props.sectionName}</span>
                    </article>
                </section>
            </main>

        );
    }
}

export default Section;
