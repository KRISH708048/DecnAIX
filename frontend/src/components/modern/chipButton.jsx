import { twMerge } from 'tailwind-merge';
import React from 'react'
import { Button } from '../ui/button';

export default function ChipsButton({ content, active, onClick }) {
    return (
        <Button onClick={onClick} className={twMerge(active === true ? "bg-yellow-400" : "bg-white", '  flex  items-center gap-2  generalTabsBorder text-black hover:text-white ')}>{content}</Button>
    )
}