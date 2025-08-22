import { defineType } from "sanity";

export const codeBlockType = defineType({
  name: "codeBlock",
  title: "Kodblock",
  type: "object",
  fields: [
    {
      name: "language",
      title: "Programmeringsspråk",
      type: "string",
      options: {
        list: [
          { title: "JavaScript", value: "javascript" },
          { title: "TypeScript", value: "typescript" },
          { title: "HTML", value: "html" },
          { title: "CSS", value: "css" },
          { title: "Python", value: "python" },
          { title: "JSON", value: "json" },
          { title: "Bash", value: "bash" },
          { title: "SQL", value: "sql" },
        ],
      },
      initialValue: "javascript",
    },
    {
      name: "filename",
      title: "Filnamn (valfritt)",
      type: "string",
    },
    {
      name: "code",
      title: "Kod",
      type: "text",
      rows: 10,
    },
  ],
  preview: {
    select: {
      title: "filename",
      subtitle: "language",
    },
    prepare(selection) {
      const { title, subtitle } = selection;
      return {
        title: title || "Kodblock",
        subtitle: subtitle ? `${subtitle.toUpperCase()}` : "Okänt språk",
      };
    },
  },
});
