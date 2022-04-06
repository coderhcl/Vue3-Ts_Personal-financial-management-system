export default {
  debug: "info",
  modules: {
    toolbar: [
      "bold",
      "italic",
      "underline",
      "strike", // toggled buttons
      "blockquote",
      "image",
      // "code-block",

      { header: 1 },
      { header: 2 }, // custom button values
      { list: "ordered" },
      { list: "bullet" },
      // { script: "sub" },
      // { script: "super" }, // superscript/subscript
      { indent: "-1" },
      { indent: "+1" }, // outdent/indent
      { direction: "rtl" }, // text direction

      { size: ["small", false, "large", "huge"] }, // custom dropdown
      { header: [1, 2, 3, 4, 5, 6, false] },

      { color: [] },
      { background: [] }, // dropdown with defaults from theme
      { font: [] },
      { align: [] },
      "clean", // remove formatting button
    ],
  },
  placeholder: "编辑您的内容...",
  theme: "snow",
}
————————————————
版权声明：本文为CSDN博主「崩波霸」的原创文章，遵循CC 4.0 BY-SA版权协议，转载请附上原文出处链接及本声明。
原文链接：https://blog.csdn.net/g18204746769/article/details/123536614
