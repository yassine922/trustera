import * as React from "react";

function AspectRatio({ ratio = 1, className, ...props }: React.HTMLAttributes<HTMLDivElement> & { ratio?: number }) {
  return (
    <div data-slot="aspect-ratio" style={{ position: "relative", paddingBottom: `${(1 / ratio) * 100}%` }}>
      <div style={{ position: "absolute", inset: 0 }} className={className} {...props} />
    </div>
  );
}

export { AspectRatio };
