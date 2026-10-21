const propsMapRaw = {
    text: "size,font,fill,stroke,tracking,spacing,style,weight,stretch,top-edge,bottom-edge,lang,region,dir,hyphenate,ligatures,number-type,number-width,slashed-zero,fractions,features,fallback,overhang,kerning,alternates,stylistic-set,script",
    par: "leading,spacing,justify,linebreaks,first-line-indent,hanging-indent",
    box: "width,height,baseline",
    block: "width,height,breakable,above,below",
    grid: "columns,rows,column-gutter,row-gutter,align",
    table: "columns,rows,column-gutter,row-gutter,align",
    list: "indent,body-indent,spacing,marker,tight",
    enum: "indent,body-indent,spacing,numbering,start,full,reversed,tight",
    terms: "indent,spacing,hanging-indent,tight",
    heading: "level,depth,offset,numbering,supplement,outlined,bookmarked,hanging-indent",
    quote: "block,quotes,attribution",
    raw: "lang,align,block,theme",
    place: "dx,dy",
    equation: "block,numbering,number-align,supplement,alt",
    image: "width,height,alt",
    figure: "placement,scope,kind,supplement,numbering,gap,outlined",
    ref: "supplement,form",
    outline: "title,depth,indent",
};

const ELEMENT_PATHS = {
    equation: "math.equation",
};

const elementPath = name => ELEMENT_PATHS[name] ?? name;

const SETTABLE = new Set(Object.keys(propsMapRaw));

const propsMap = {};
Object.keys(propsMapRaw).forEach(ifunc => {
    propsMap[ifunc] = propsMapRaw[ifunc]
        .split(",")
        .map(s => s.trim())
        .filter(Boolean);
});

function blockComment(title) {
    return `// ${"=".repeat(72)}\n// ${title}\n// ${"=".repeat(72)}`;
}

function genCapture() {
    const lines = [];
    lines.push(blockComment("BEGIN GENERATED CAPTURE BLOCK"));
    lines.push("");

    for (const [name, props] of Object.entries(propsMap)) {
        lines.push(`  if saving-${name} {`);
        lines.push(`    moment.${name} = (`);
        for (const prop of props) {
            lines.push(`      ${prop}: _rawfuncmap.${name}.${prop},`);
        }
        lines.push(`    )`);
        lines.push(`  }`);
        lines.push("");
    }

    lines.push(blockComment("END GENERATED CAPTURE BLOCK"));
    return lines.join("\n");
}

function genApply() {
    const lines = [];
    lines.push(blockComment("BEGIN GENERATED APPLY BLOCK"));
    lines.push("");
    lines.push(`  let apply(body) = {`);

    lines.push(`    let setters = ()`);

    for (const [name, props] of Object.entries(propsMap)) {
        if (!SETTABLE.has(name)) continue;

        if (name === "text") {
            lines.push(`    if saving-text {`);
            lines.push(`      setters.push(it => {`);
            lines.push(`        set ${elementPath(name)}(`);
            for (const prop of props) {
                lines.push(`          ${prop}: moment.${name}.${prop},`);
            }
            lines.push(`        )`);
            lines.push(`        it`);
            lines.push(`      })`);
            lines.push(`    }`);
            continue;
        }

        if (name === "place") {
            lines.push(`    // note: set place is mostly a no-op; kept for completeness`);
        }

        lines.push(`    if saving-${name} {`);
        lines.push(`      setters.push(it => {`);
        lines.push(`        set ${elementPath(name)}(`);
        for (const prop of props) {
            lines.push(`          ${prop}: moment.${name}.${prop},`);
        }
        lines.push(`        )`);
        lines.push(`        it`);
        lines.push(`      })`);
        lines.push(`    }`);
    }

    lines.push("");
    lines.push(`    show: it => setters.fold(it, (acc, f) => f(acc))`);
    lines.push(`    body`);
    lines.push(`  }`);
    lines.push("");
    lines.push(blockComment("END GENERATED APPLY BLOCK"));

    return lines.join("\n");
}

const output = [
    genCapture(),
    "",
    genApply(),
].join("\n").replace(`_rawfuncmap.text.size`, `resolved-text-size`);

console.log(output);

/*
node aux/generator.js | pbcopy
*/
