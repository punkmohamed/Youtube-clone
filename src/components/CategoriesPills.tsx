import { ChevronLeft, ChevronRight } from "lucide-react"
import Button from "./Button"
import { useEffect, useRef, useState } from "react"

type CategoriesPillsProps = {
    categories: string[]
    selectedCat: string,
    onSelect: (category: string) => void
}
const TRANSLATE_AMOUNT = 200
const CategoriesPills = ({ categories, selectedCat, onSelect }: CategoriesPillsProps) => {
    const [isLeftVisible, setIsLeftVisible] = useState(false);
    const [isRightVisible, setIsRightVisible] = useState(false);
    const [translate, setTranslate] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null)
    useEffect(() => {
        if (containerRef.current == null) return

        const observer = new ResizeObserver(entries => {
            const container = entries[0]?.target
            if (container == null) return

            setIsLeftVisible(translate > 0)
            setIsRightVisible(
                translate + container.clientWidth < container.scrollWidth
            )
        })

        observer.observe(containerRef.current)

        return () => {
            observer.disconnect()
        }
    }, [categories, translate])
    return (
        <div ref={containerRef} className="overflow-x-hidden relative">
            <div className="flex whitespace-nowrap gap-3 transition-transform w-[max-content]" style={{ transform: `translateX(-${translate}px)` }}>
                {categories.map((cat) => (
                    <Button onClick={() => onSelect(cat)} key={cat} variant={selectedCat === cat ? "dark" : "default"} className="py-1 px-3 rounded-lg whitespace-nowrap">{cat}</Button>
                ))}

            </div>
            {isLeftVisible && <div className=" absolute left-0 top-1/2 -translate-y-1/2 bg-gradient-to-r from-white from-50% to-transparent w-24 h-full">
                <Button onClick={() => setTranslate(translate => {
                    const newTranslate = translate - TRANSLATE_AMOUNT
                    if (newTranslate <= 0) return 0
                    return newTranslate
                })} variant="ghost" size="icon" className="h-full aspect-square w-auto p-1.5">
                    <ChevronLeft />
                </Button>
            </div>}
            {isRightVisible && <div className=" absolute right-0 top-1/2 -translate-y-1/2 bg-gradient-to-l  flex justify-end from-white from-50% to-transparent w-24 h-full">
                <Button onClick={() => {
                    setTranslate(translate => {
                        if (containerRef.current == null) {
                            return translate
                        }
                        const newTranslate = translate + TRANSLATE_AMOUNT
                        const edge = containerRef.current.scrollWidth
                        const width = containerRef.current.clientWidth
                        if (newTranslate + width >= edge) {
                            return edge - width
                        }
                        return newTranslate
                    })
                }} variant="ghost" size="icon" className="h-full aspect-square w-auto p-1.5">
                    <ChevronRight />
                </Button>
            </div>}
        </div>
    )
}

export default CategoriesPills