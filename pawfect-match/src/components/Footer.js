import React from 'react'
import { Chewy } from 'next/font/google';

const chewy = Chewy({
    weight: '400',
    subsets: ['latin'],
});

const Footer = () => {
    return (
        <footer className="footer footer-horizontal footer-center bg-primary text-primary-content p-10">
            <aside>
                <img src="/footer.png" className='w-24 py-4'></img>
                <p className={`text-xl font-semibold  ${chewy.className}`}>
                    Pawfect Match
                </p>
            </aside>
        </footer>
    )
}

export default Footer
