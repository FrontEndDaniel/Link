import { FormEvent, useEffect, useState } from "react"
import { Header } from "../../components/header"
import { Input } from "../../components/input"
import { FiTrash } from "react-icons/fi"
import { db } from "../../services/firebaseConection"
import { addDoc, collection, onSnapshot, query, orderBy, doc, deleteDoc } from "firebase/firestore"

interface linkProps {
    id: string,
    name: string,
    url: string,
    bg: string,
    color: string,

}

export function Admin() {

    const [nameInput, setNameInput] = useState("")
    const [urlInput, setUrlInput] = useState("")
    const [textColorInput, setTextColorInput] = useState("#f1f1f1")
    const [bgColorInput, setBgColorInput] = useState("#121212")
    const [links, setLinks] = useState<linkProps[]>([])

    useEffect(() => {
        const linksRef = collection(db, "links");
        const queryRef = query(linksRef, orderBy("created", "asc"))

        const unsub = onSnapshot(queryRef, (snapshot) => {
            let list = [] as linkProps[];

            snapshot.forEach((doc) => {
                list.push({
                    id: doc.id,
                    name: doc.data().name,
                    url: doc.data().url,
                    bg: doc.data().bg,
                    color: doc.data().color
                })
            })
            setLinks(list)
        })
        return () => {
            unsub();
        }
    }, [])

    async function handleRegister(e: FormEvent) {
        e.preventDefault();
        if (nameInput === '' || urlInput === '') {
            return;
        }

        addDoc(collection(db, "links"), {
            name: nameInput,
            url: urlInput,
            bg: bgColorInput,
            color: textColorInput,
            created: new Date()
        })
            .then(() => {
                setNameInput("");
                setUrlInput("");
            })
            .catch((error) => {
                console.log("Error ao cadastrar", error)
            })

    }

    async function handleDeleteLink(id: string) {
        const docRef = doc(db, "links", id);
        await deleteDoc(docRef)
    }

    return (
        <div className="flex items-center flex-col min-h-screen pb-7 px-2">
            <Header />
            <form className="flex flex-col mt-8 mb-3 w-full max-w-xl" onSubmit={handleRegister}>

                <label className="text-white font-medium mt-2 mb-2">Nome do Link</label>

                <Input
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    placeholder="Digite o nome do link..." />

                <label className="text-white font-medium mt-2 mb-2">URL do Link</label>

                <Input
                    type="url"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="Digite a URL..." />

                <section className="flex my-4 gap-5">

                    <div className="flex gap-4">
                        <label className="text-white font-medium mt-2 mb-2">Cor texto do Link</label>
                        <input
                            type="color"
                            value={textColorInput}
                            onChange={(e) => setTextColorInput(e.target.value)} />
                    </div>

                    <div className="flex gap-4">
                        <label className="text-white font-medium mt-2 mb-2">Fundo do Link</label>
                        <input
                            type="color"
                            value={bgColorInput}
                            onChange={(e) => setBgColorInput(e.target.value)} />
                    </div>

                </section>
                {nameInput !== "" && (
                    <div className="flex items-center justify-start flex-col mb-7 p-1 border-gray-100/25 border rounded-md">
                        <label className="text-white font-medium mt-2 mb-2">Vejá como esta ficando:</label>
                        <article
                            className="w-11/12 max-w-lg flex flex-col items-center justify-between bg-zinc-900 rounded px-1 py-3"
                            style={{ marginBottom: 8, marginTop: 8, backgroundColor: bgColorInput }}>
                            <p
                                className="font-medium"
                                style={{ color: textColorInput }}>{nameInput}</p>
                        </article>
                    </div>
                )}

                <button className="bg-blue-600 h-9 rounded-md text-white font-medium gap-4 flex justify-center items-center"
                    type="submit">Cadastrar</button>
            </form>

            <h2 className="font-bold text-white mb-4 text-2xl">Meus Links</h2>

            {links.map((item) => (
                <article
                    key={item.id}
                    className="flex items-center justify-between w-11/12 max-w-xl rounded py-3 px-2 mb-2 select-none"
                    style={{ backgroundColor: item.bg, color: item.color }}>
                    <p>{item.name}</p>
                    <div>
                        <button
                            className="border border-dashed p-1 rounded bg-neutral-900"
                            onClick={() => handleDeleteLink(item.id)}
                        ><FiTrash size={18} color="#fff" /></button>
                    </div>
                </article>
            ))}
        </div>
    )
}