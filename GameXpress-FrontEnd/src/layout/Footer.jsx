import React from 'react'

function Footer() {
    return (
        <>
            <footer className="bg-gray-900 text-white pt-10 pb-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                        <div>
                            <h3 className="text-xl font-bold text-green-400 mb-4">GameExpress</h3>
                            <p className="text-sm text-gray-300">
                                Your ultimate destination for the latest and greatest in gaming. Play hard, level up, and join the community.
                            </p>
                        </div>
                        <div>
                            <h4 className="text-lg font-semibold text-green-400 mb-4">Quick Links</h4>
                            <ul className="space-y-2 text-sm text-gray-300">
                                <li><a href="#" className="hover:text-green-400 transition">Home</a></li>
                                <li><a href="#" className="hover:text-green-400 transition">Games</a></li>
                                <li><a href="#" className="hover:text-green-400 transition">Store</a></li>
                                <li><a href="#" className="hover:text-green-400 transition">Support</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-lg font-semibold text-green-400 mb-4">Follow Us</h4>
                            <div className="flex space-x-4">
                                <a href="#" className="text-gray-300 hover:text-green-400 transition">
                                    <i className="fab fa-facebook-f"></i> Facebook
                                </a>
                                <a href="#" className="text-gray-300 hover:text-green-400 transition">
                                    <i className="fab fa-twitter"></i> Twitter
                                </a>
                                <a href="#" className="text-gray-300 hover:text-green-400 transition">
                                    <i className="fab fa-discord"></i> Discord
                                </a>
                            </div>
                        </div>
                        <div>
                            <h4 className="text-lg font-semibold text-green-400 mb-4">Newsletter</h4>
                            <p className="text-sm text-gray-300 mb-2">Stay updated with new game releases and offers.</p>
                            <form className="flex">
                                <input type="email" placeholder="Your email"
                                    className="w-full px-3 py-2 rounded-l-md bg-gray-800 text-white border border-gray-700 focus:outline-none"></input>
                                <button type="submit"
                                    className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-r-md text-white font-semibold transition">
                                    Subscribe
                                </button>
                            </form>
                        </div>
                    </div>

                    <div className="border-t border-gray-700 mt-10 pt-4 text-center text-sm text-gray-400">
                        &copy; 2025 GameExpress. All rights reserved.
                    </div>
                </div>
            </footer>

        </>
    )
}

export default Footer