import { Social } from "../../components/social"
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa"
import { db } from "../../services/firebaseConection"
import { getDocs, collection, orderBy, doc, getDoc, query, snapshotEqual } from "firebase/firestore"
import { useEffect, useState } from "react"
import { Header } from "../../components/header"
interface linkProps {
    id: string,
    name: string,
    url: string,
    bg: string,
    color: string,

}

interface socialLinkProps {
    facebook: string,
    instagram: string,
    youtube: string

}

export function Home() {

    const [links, setLinks] = useState<linkProps[]>([])
    const [socialLinks, setSocialLinks] = useState<socialLinkProps>()

    useEffect(() => {
        function loadLinks() {
            const linksRef = collection(db, "links")
            const queryRef = query(linksRef, orderBy("created", "asc"))

            getDocs(queryRef)
                .then((snapshot) => {
                    let list = [] as linkProps[];

                    snapshot.forEach((doc) => {
                        list.push({
                            id: doc.data().id,
                            name: doc.data().name,
                            url: doc.data().url,
                            bg: doc.data().bg,
                            color: doc.data().color,
                        })
                    })
                    setLinks(list)
                })

        }
        loadLinks();
    }, [])

    useEffect(() => {
        function loadSocialLinks() {
            const docRef = doc(db, "social", "link")
            getDoc(docRef)
                .then((snapshot) => {
                    if (snapshot.data() !== undefined) {
                        setSocialLinks({
                            facebook: snapshot.data()?.facebook,
                            instagram: snapshot.data()?.instagram,
                            youtube: snapshot.data()?.youtube,
                        })
                    }
                })
        }
        loadSocialLinks();
    }, [])

    return (
        <div className="flex flex-col w-full pb-4 px-2 items-center justify-center">
            <Header/>
            <h1 className="md:text-4xl text-3xl font-bold text-white mt-20">Leesco Dev</h1>
            <span className="text-gray-50 mb-5 mt-3">Veja meus links 👇</span>

            <main className="flex flex-col w-11/12 max-w-xl text-center" >
                {links.map((item) => (
                    <section
                        key={item.id}
                        style={{ backgroundColor: item.bg, color: item.color }}
                        className="bg-white mb-4 w-full py-2 rounded-lg select-none transition-transform hover:scale-105 cursor-pointer">
                        <a href={item.url} target="_blank">
                            <p className="md:text-lg text-base">
                                {item.name}
                            </p>
                        </a>
                    </section>
                ))}
                {socialLinks && Object.keys(socialLinks).length > 0 && (
                    <footer className="flex justify-center gap-3 my-4">
                        <Social url={socialLinks?.facebook}>
                            <FaFacebook size={35} color="#fff" />
                        </Social>
                        <Social url={socialLinks?.youtube}>
                            <FaYoutube size={35} color="#fff" />
                        </Social>
                        <Social url={socialLinks?.instagram}>
                            <FaInstagram size={35} color="#fff" />
                        </Social>
                    </footer>
                )}
            </main>
        </div>
    )
}