import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
    const navigate = useNavigate();
    const isLoggedIn = !!localStorage.getItem("token");

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    return (
        <nav className="w-full bg-white shadow-sm">
            <div className="flex items-center justify-between px-4 py-3 md:px-10">

                {isLoggedIn && (
                    <Link to={"/post"}>
                        <h1 className="font-Pacifico text-purple-600 text-2xl font-bold">
                            Jam
                        </h1>
                    </Link>
                )}
                {!isLoggedIn && (
                    <Link to={"/"}>
                        <h1 className="font-Pacifico text-purple-600 text-2xl font-bold">
                            Jam
                        </h1>
                    </Link>
                )}

                <button
                    className="md:hidden text-gray-600 text-2xl"
                    onClick={() => setOpen(!open)}
                >
                    ☰
                </button>

                <div className="hidden md:flex gap-6 text-gray-700 text-sm">
                    {!isLoggedIn && (
                        <>
                            <Link to="/" className="hover:text-purple-600 text-xl">Home</Link>
                        </>
                    )}
                    {isLoggedIn && (
                        <>
                            <Link to="/post" className="hover:text-purple-600 text-base hover:scale-140 transition-transform duration-300 inline-block">Post</Link>
                            <Link to="/discover" className="hover:text-purple-600 text-base hover:scale-140 transition-transform duration-300 inline-block">Discover</Link>
                            <Link to="/communities" className="hover:text-purple-600 text-base hover:scale-140 transition-transform duration-300 inline-block">Communities</Link>
                            <Link to="/profile" className="hover:text-purple-600 text-base hover:scale-140 transition-transform duration-300 inline-block">Profile</Link>

                        </>
                    )}

                </div>

                <div className="hidden md:flex gap-3">
                    {isLoggedIn && (
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
                        >
                            Logout
                        </button>
                    )}
                    {!isLoggedIn && (
                        <>
                            <Link
                                to="/signup"
                                className="bg-purple-600 text-white px-4 py-1 rounded hover:bg-purple-700"
                            >
                                Sign Up
                            </Link>
                            <Link to="/login" className="bg-purple-600 text-white px-4 py-1 rounded hover:bg-purple-700">Login</Link>
                        </>
                    )}
                </div>
            </div>

            {open && (
                <div className="md:hidden flex flex-col items-start gap-3 px-6 pb-4 bg-white shadow-lg">
                    <Link onClick={() => setOpen(false)} className="hover:text-purple-600" to="/">Home</Link>
                    <Link onClick={() => setOpen(false)} className="hover:text-purple-600" to="/Discover">Discover</Link>
                    <Link onClick={() => setOpen(false)} className="hover:text-purple-600" to="/Communities">Communities</Link>
                    <Link onClick={() => setOpen(false)} className="hover:text-purple-600" to="/Post">Post</Link>
                    <Link onClick={() => setOpen(false)} className="hover:text-purple-600" to="/Profile">Profile</Link>

                    <div className="flex gap-3 mt-3">
                        <Link to="/signup">
                            <button className="px-3 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
                                Sign Up
                            </button>
                        </Link>

                        <Link to="/login">
                            <button className="px-3 py-1 bg-purple-200 text-purple-700 rounded-lg hover:bg-purple-300 transition">
                                Log In
                            </button>
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
