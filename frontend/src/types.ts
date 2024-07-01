import { Icon } from 'lucide-react';

export type jobsArray = string[][]

export interface CardDataProps {
    cardData: CardData
}

export interface ButtonComponentProps {
    text: string,
    className: string,
    path: string
}

export interface CardData {
    icon: typeof Icon,
    title: string,
    paragraph: string,
    color: string,
    backgroundColor: string,
}

export interface HiredTip {
    icon: typeof Icon,
    color: string,
    backgroundColor: string,
    title: string,
    paragraph: string,
}

export type HiredTipProps = HiredTip[]