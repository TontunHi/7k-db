import sanitizeHtml from "sanitize-html"

/**
 * Safe HTML Sanitizer configuration for Rich Text (TipTap Editor outputs).
 * Removes any potentially dangerous scripts or events to prevent Stored XSS.
 */
export function sanitizeHTML(dirty: string): string {
    if (!dirty || typeof dirty !== "string") return ""

    return sanitizeHtml(dirty, {
        allowedTags: [
            "address", "article", "aside", "footer", "header", "h1", "h2", "h3", "h4",
            "h5", "h6", "hgroup", "main", "nav", "section", "blockquote", "dd", "div",
            "dl", "dt", "figcaption", "figure", "hr", "li", "main", "ol", "p", "pre",
            "ul", "a", "abbr", "b", "bdi", "bdo", "br", "cite", "code", "data", "dfn",
            "em", "i", "kbd", "mark", "q", "rb", "rp", "rt", "rtc", "ruby", "s", "samp",
            "small", "span", "strong", "sub", "sup", "time", "u", "var", "wbr", "img",
            "iframe"
        ],
        allowedAttributes: {
            a: ["href", "name", "target", "rel"],
            img: ["src", "alt", "title", "width", "height", "loading"],
            iframe: ["src", "width", "height", "frameborder", "allow", "allowfullscreen", "style"],
            span: ["style", "class"],
            p: ["style", "class"],
            div: ["style", "class"]
        },
        allowedClasses: {
            span: ["*"],
            p: ["*"],
            div: ["*"]
        },
        allowedSchemes: ["http", "https", "mailto", "tel", "data"],
        allowedIframeHostnames: ["www.youtube.com", "youtube.com", "youtu.be", "player.vimeo.com"]
    })
}
