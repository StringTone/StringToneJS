class HTMLInclude extends HTMLElement {
    constructor(...attr) {
        super();
        Object.assign(this, ...attr);

        this.attachShadow({ mode: "open" });
        this.loadContent();
    }

    async loadContent() {
        try {
            let htmlSource = this.hasAttribute("src") ? this.getAttribute("src") : "about:blank";
            const srcContent = await fetch(htmlSource);
            const htmlCode = document.createDocumentFragment();
            const codeSlot = document.createElement("div");
            codeSlot.dataset.parent = this;
            htmlCode.append(codeSlot);
            codeSlot.innerHTML = await srcContent.text();
            // const style = document.createElement("style");
            this.shadowRoot.append(htmlCode);
        } catch (error) {
            console.error('ERROR', error);
        }
    }
}
customElements.define("include-html", HTMLInclude);
// 
// function getHTMLIncludes(includeName=""){
//     let htmlIncludes = [];
//     if(window.HTMLIncludes) 
//         htmlIncludes = window.HTMLIncludes; 
//     else {
//         let includeCodex    = [];
//         let codexIndex      = -1;
//         htmlIncludes = document.getElementsByTagName("include");
//         if(htmlIncludes) htmlIncludes.forEach(element => {
//             let {name, src} = element.attributes;
//             if(!name)  name = {value: codexIndex++};
//             includeCodex.push(Object.fromEntries([[name.value, src.value]]));
// 
//         });
//         window.HTMLIncludes = htmlIncludes = includeCodex;
//     }
// 
//     if(!htmlIncludes || htmlIncludes.length === 0) return null;
// }
// 
// document.addEventListener("DOMContentLoaded", function () {
//   document.getElementsByTagName("include");
//   for (var tag = 0; tag < includeTags.length; tag++) {
//     let activeTag = includeTags[tag];
//     loadFile(includeTags[tag].attributes.src.value, function (includeTags) {
//       activeTag.insertAdjacentHTML("afterend", includeTags), activeTag.remove();
//     });
//   }
//   function loadFile(includeTags, tag) {
//     fetch(includeTags)
//       .then((includeTags) => includeTags.text())
//       .then((includeTags) => tag(includeTags));
//   }
// });
