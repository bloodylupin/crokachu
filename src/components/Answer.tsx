import { ReactNode } from "react";

import { classNames } from "../utilities/classNames";

type AnswerProps = {
    children: ReactNode
    success: boolean
}

export default function Answer({ children, success }: AnswerProps) {
    return (
        <div className={classNames(success ? "bg-lime-800" : "bg-red-800", "p-4 rounded")}>
            <h3 className="p-4 text-base">{success ? "Hooray!" : "Something went wrong..."}</h3>
            <hr />
            <p className="p-4">{children}</p>
        </div>
    )
}
