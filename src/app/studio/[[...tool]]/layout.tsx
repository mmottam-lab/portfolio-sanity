export default function StudioLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div style={{ margin: 0, height: "calc(100vh - 64px)" }}>{children}</div>
    );
}
