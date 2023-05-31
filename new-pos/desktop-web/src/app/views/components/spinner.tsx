import { PagePropCommonDocument } from "modules/views/pages/pageProps";
import { Component } from "react";

type PageProps = {} & PagePropCommonDocument;

type PageState = {
  className?: string | undefined;
  strokeWidth?: string | number | undefined;
  duration?: string | number | undefined;
};

class Spinner extends Component<PageProps, PageState> {
  constructor(props: any) {
    super(props);
    this.state = {
      className: "",
      strokeWidth: "",
      duration: 2.5,
    };
  }

  render() {
    return (
      <svg
        className={this.state.className}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="25 25 50 50"
      >
        <circle
          cx="50"
          cy="50"
          r="20"
          fill="none"
          strokeWidth={this.state.strokeWidth ?? 3}
          stroke="currentColor"
          strokeLinecap="round"
          strokeDashoffset="0"
          strokeDasharray="100, 200"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 50 50"
            to="360 50 50"
            dur={`${this.state.duration}s`}
            repeatCount="indefinite"
          />
          <animate
            attributeName="stroke-dashoffset"
            values="0;-30;-124"
            dur="1.25s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="stroke-dasharray"
            values="0,200;110,200;110,200"
            dur="1.25s"
            repeatCount="indefinite"
          />
        </circle>
      </svg>
    );
  }
}

export default Spinner;
