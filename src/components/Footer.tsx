"use client"

import Link from 'next/link'
import React from 'react'

function Footer() {
    return (
        <footer className="mt-10 text-center text-sm text-gray-500">
            Made with ❤️ by <Link href={`https://saranzafar.github.io`} className="text-teal-600 hover:text-teal-700 font-semibold">saranzafar</Link>
        </footer>
    )
}

export { Footer }