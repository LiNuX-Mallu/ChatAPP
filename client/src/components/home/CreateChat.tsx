interface Props {
    create: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function CreateChat({create}: Props) {
    return (
        <div 
            onClick={(e) => e.stopPropagation()}
            className="pt-10 pb-5 flex fixed left-0 right-0 top-0 bottom-0 md:right-[30%] md:top-[20%] md:left-[30%] md:bottom-[20%] bg-gray-900 rounded-md flex-col justify-between items-center"
        >
            {/* close icon for small screens*/}
            <i onClick={() => create(false)} className="absolute md:hidden text-white top-3 right-3 fa-regular fa-circle-xmark"></i>

            <h1 className="text-2xl font-semibold mb-10 text-gray-300">Create Chat</h1>
            <div className="flex flex-col justify-center items-center w-full gap-2">
                <input type="text" placeholder="Chat Name" className="w-2/3 ps-3 p-2 capitalize font-medium text-gray-200 text-sm  border-0 outline-none rounded-sm bg-slate-700" />
                <textarea placeholder="Description" rows={5} className="w-2/3 p-1 ps-3 font-medium text-gray-200 text-sm border-0 outline-none rounded-sm resize-none bg-slate-700"></textarea>
            </div>
            <button className="bg-gray-800 text-gray-200 p-1 ps-3 text-md pe-3 rounded-md font-medium">Create</button>
        </div>
    )
}