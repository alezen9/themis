// MathJax tex -> SVG, built once. liteAdaptor is DOM-free and doc.convert is
// synchronous, so rendering is drop-in synchronous and the same output will feed
// react-pdf reports later. fontCache "none" => self-contained SVGs (no <defs>/<use>
// id collisions when many are injected via innerHTML; fill inherits currentColor).
import { mathjax } from "mathjax-full/js/mathjax.js";
import { TeX } from "mathjax-full/js/input/tex.js";
import { SVG } from "mathjax-full/js/output/svg.js";
import { liteAdaptor } from "mathjax-full/js/adaptors/liteAdaptor.js";
import { RegisterHTMLHandler } from "mathjax-full/js/handlers/html.js";

import "mathjax-full/js/input/tex/base/BaseConfiguration.js";
import "mathjax-full/js/input/tex/ams/AmsConfiguration.js";
import "mathjax-full/js/input/tex/noundefined/NoUndefinedConfiguration.js";
import "mathjax-full/js/input/tex/noerrors/NoErrorsConfiguration.js";
import "mathjax-full/js/input/tex/mathtools/MathtoolsConfiguration.js";
import "mathjax-full/js/input/tex/color/ColorConfiguration.js";
import "mathjax-full/js/input/tex/enclose/EncloseConfiguration.js";
import "mathjax-full/js/input/tex/bbox/BboxConfiguration.js";
import "mathjax-full/js/input/tex/html/HtmlConfiguration.js";

const adaptor = liteAdaptor();
RegisterHTMLHandler(adaptor);

const doc = mathjax.document("", {
  InputJax: new TeX({
    packages: [
      "base",
      "ams",
      "noundefined",
      "noerrors",
      "mathtools",
      "color",
      "enclose",
      "bbox",
      "html",
    ],
  }),
  OutputJax: new SVG({ fontCache: "none" }),
});

export const texToSvg = (tex: string, display: boolean) =>
  adaptor.innerHTML(doc.convert(tex, { display }));
