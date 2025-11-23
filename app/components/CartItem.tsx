import { useState } from "react";

interface CartItemProps {
    id: string;
    title: string;
    price: number;
    image: string;
    quantity: number;
    onUpdateQuantity: (id: string, newQuantity: number) => void;
    onRemove: (id: string) => void;
}

export default function CartItem({
    id,
    title,
    price,
    image,
    quantity,
    onUpdateQuantity,
    onRemove,
}: CartItemProps) {
    return (
        <div className="flex items-center gap-4 py-4 border-b border-gray-200 last:border-0">
            <div className="w-24 h-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                <img
                    src={image}
                    alt={title}
                    className="h-full w-full object-cover object-center"
                />
            </div>

            <div className="flex flex-1 flex-col">
                <div>
                    <div className="flex justify-between text-base font-medium text-gray-900">
                        <h3>
                            <a href="#">{title}</a>
                        </h3>
                        <p className="ml-4">${(price * quantity).toFixed(2)}</p>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">${price.toFixed(2)} each</p>
                </div>
                <div className="flex flex-1 items-end justify-between text-sm">
                    <div className="flex items-center border border-gray-300 rounded-md">
                        <button
                            type="button"
                            className="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                            onClick={() => onUpdateQuantity(id, quantity - 1)}
                            disabled={quantity <= 1}
                        >
                            -
                        </button>
                        <span className="px-2 py-1 text-gray-900 font-medium min-w-[2rem] text-center">
                            {quantity}
                        </span>
                        <button
                            type="button"
                            className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                            onClick={() => onUpdateQuantity(id, quantity + 1)}
                        >
                            +
                        </button>
                    </div>

                    <div className="flex">
                        <button
                            type="button"
                            onClick={() => onRemove(id)}
                            className="font-medium text-indigo-600 hover:text-indigo-500"
                        >
                            Remove
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
