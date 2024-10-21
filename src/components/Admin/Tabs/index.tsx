import React, { useState } from 'react';

type TabProps = {
    title: string;
    activeKey: string;
    children: React.ReactNode;
}

export const Tab = ({children} : TabProps) => {
    return (
        <div>
            {children}
        </div>
    );
};

type TabsProps = {
    defaultActiveKey: string;
    className?: string;
    children: React.ReactElement<TabProps>[];
}

const Tabs = (props: TabsProps) => {
    const { defaultActiveKey, className, children } = props;
    const [currentActiveKey, setCurrentActiveKey] = useState<string>(defaultActiveKey);

    const handleTabClick = (key: string) => {
        setCurrentActiveKey(key);
    };

    return (
        <div className={`${className}`}>
            <div className="flex items-center gap-x-3">
                {
                    React.Children.map(children, (child) => {
                        const {title, activeKey } = child.props;
                        const isActive = activeKey === currentActiveKey;
                        return (
                            <button
                                type="button"
                                className={`text-sm border-b-[3px] px-5 focus-visible:outline-none border-b-transparent ${isActive && '!border-gray-400'}`}
                                onClick={() => handleTabClick(activeKey)}
                            >
                                {title}
                            </button>
                        );
                    })
                }
            </div>
            <div className="mt-2">
                {
                    React.Children.map(children, (child) => {
                        return child.props.activeKey === currentActiveKey ? child : null;
                    })
                }
            </div>
        </div>
    );
};

export default Tabs;