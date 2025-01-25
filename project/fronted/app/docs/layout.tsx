

export default function EVMLayout({
    children
}: Readonly<{
    children: React.ReactNode
}>) {

    return (
        <html lang="en">
            <body>
                    <div className='z-999 bg-white'>
                        {children}
                    </div>
            </body>
        </html>
    )
}