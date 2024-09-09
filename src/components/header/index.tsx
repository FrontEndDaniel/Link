import { BiLogOut, BiLogIn } from "react-icons/bi"
import { Link, useNavigate } from "react-router-dom"
import { auth } from "../../services/firebaseConection"
import { signOut } from "firebase/auth"
import { useEffect, useState } from "react"
import { onAuthStateChanged } from "firebase/auth";



export function Header() {

    const [loading, setLoading] = useState(true)
    const [signed, setSigned] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (user) => {
            if (user) {
                setLoading(false);
                setSigned(true);
            } else {

                setLoading(false);
                setSigned(false);
            }
        })

        return () => {
            unsub();
        }
    }, [])


    async function handleLogout() {
        await signOut(auth);
    }
    function handleLogin(){
        navigate("/login")
    }
    return (
        <header className="w-full max-w-2x1 mt-4 px-1">
            <nav className="w-full bg-white h-12 flex items-center justify-between rounded-md px-3">
                <div className="flex gap-4 font-medium">
                    <Link to="/">Home</Link>
                    {signed && (
                        <div>
                            <Link to="/admin">Adicionar Links</Link>
                            <Link to="/admin/social"> Adicionar Rede Socias</Link>
                        </div>
                    )}
                </div>
                {signed && (
                    <button onClick={handleLogout}><BiLogOut size={28} color="#db2629" /></button>
                )}
                {signed === false && (
                    <button onClick={handleLogin}><BiLogIn size={28} color="blue" /></button>
                )}

            </nav>
        </header>
    )
}