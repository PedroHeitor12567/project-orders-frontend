import { site } from "../../data/site";
import { Icon } from "./Icon";

export function Brand() {
  return (
    <a className="brand" href="#inicio" aria-label={`${site.brand}, ir ao início`}>
      <span className="brand__mark">
        <Icon name="code" size={16} />
      </span>
      <span className="brand__name">{site.brand}</span>
    </a>
  );
}
