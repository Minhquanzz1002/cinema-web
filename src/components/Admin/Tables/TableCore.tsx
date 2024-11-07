import React from 'react';
import { cn } from '@/lib/utils';

type TableCoreProps = React.HTMLAttributes<HTMLTableElement>
type TableHeaderProps = React.HTMLAttributes<HTMLTableSectionElement>
type TableRowHeaderProps = React.HTMLAttributes<HTMLTableRowElement>
type TableRowBodyProps = React.HTMLAttributes<HTMLTableRowElement>
type TableHeadProps = React.HTMLAttributes<HTMLTableCellElement>
type TableBodyProps = React.HTMLAttributes<HTMLTableSectionElement>
type TableCellProps = React.TdHTMLAttributes<HTMLTableCellElement>

interface TableCoreComponent
    extends React.ForwardRefExoticComponent<
        TableCoreProps & React.RefAttributes<HTMLTableElement>
    > {
    Header: typeof Header;
    Body: typeof Body;
    // Footer: typeof Footer;
    RowHeader: typeof RowHeader;
    RowBody: typeof RowBody;
    Head: typeof Head;
    Cell: typeof Cell;
}

const TableCore = React.forwardRef<HTMLTableElement, TableCoreProps>(({
                                                                                                  className,
                                                                                                  ...props
                                                                                              }, ref) => (
    <div className="w-full overflow-x-scroll xl:overflow-x-hidden">
        <table ref={ref} className={cn("w-full", className)} {...props} />
    </div>
)) as TableCoreComponent;

TableCore.displayName = 'TableCore';

const Header = React.forwardRef<HTMLTableSectionElement, TableHeaderProps>(
    ({ className, ...props }, ref) => (
        <thead
            ref={ref}
            className={cn("", className)}
            {...props}
        />
    )
);
Header.displayName = "Table.Header";

const RowHeader = React.forwardRef<HTMLTableRowElement, TableRowHeaderProps>(
    ({ className, ...props }, ref) => (
        <tr
            ref={ref}
            className={cn(
                "h-14 border-t",
                className
            )}
            {...props}
        />
    )
);
RowHeader.displayName = "Table.RowHeader";

const RowBody = React.forwardRef<HTMLTableRowElement, TableRowBodyProps>(
    ({ className, ...props }, ref) => (
        <tr
            ref={ref}
            className={cn(
                "border-t last-of-type:border-b",
                className
            )}
            {...props}
        />
    )
);
RowBody.displayName = "Table.RowBody";


const Head = React.forwardRef<HTMLTableCellElement, TableHeadProps>(
    ({ className, children, ...props }, ref) => (
        <th
            ref={ref}
            className={`text-tiny text-gray-800 dark:text-white uppercase border-gray-200 px-4 py-2 first-of-type:pr-0 ${className}`}
            {...props}
        >
            <div className="flex justify-start">{children}</div>
        </th>
    )
);

Head.displayName = 'TableCore.Head';

const Body = React.forwardRef<HTMLTableSectionElement, TableBodyProps>(
    ({ className, ...props }, ref) => (
        <tbody
            ref={ref}
            className={className}
            {...props}
        />
    )
);
Body.displayName = "Table.Body";

const Cell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
    ({ className, ...props }, ref) => (
        <td
            ref={ref}
            className={cn("text-sm dark:text-white px-4 py-2 first-of-type:pr-0", className)}
            {...props}
        />
    )
);
Cell.displayName = "Table.Cell";


TableCore.Header = Header;
TableCore.Head = Head;
TableCore.RowHeader = RowHeader;
TableCore.RowBody= RowBody;
TableCore.Body = Body;
TableCore.Cell = Cell;

export default TableCore;