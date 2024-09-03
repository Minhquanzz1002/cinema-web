"use client";
import React, {useState} from 'react';
import Card from "@/components/Admin/Card";
import Calendar from "react-calendar";
import {MdChevronLeft, MdChevronRight} from "react-icons/md";
import "@/styles/MiniCalendar.admin.css"

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

const MiniCalendar = () => {
    const [value, onChange] = useState<Value>(new Date());

    return (
        <div>
            <Card extra="px-3 py-3 h-full w-full">
                <Calendar
                    onChange={onChange}
                    value={value}
                    prevLabel={<MdChevronLeft className="ml-1 h-6 w-6 " />}
                    nextLabel={<MdChevronRight className="ml-1 h-6 w-6 " />}
                    view='month'
                />
            </Card>
        </div>
    );
};

export default MiniCalendar;