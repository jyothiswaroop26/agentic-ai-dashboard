import type { ReactNode } from "react";

export interface TableColumn<T> {
	key: string;
	label: string;
	render?: (value: unknown, row: T, index: number) => ReactNode;
	align?: "left" | "center" | "right";
	width?: string;
}

export interface TableProps<T extends Record<string, unknown>> {
	columns: TableColumn<T>[];
	rows: T[];
	rowKey?: keyof T | ((row: T) => string);
	loading?: boolean;
	emptyMessage?: string;
	caption?: string;
	className?: string;
}

const Spinner = () => (
	<tr>
		<td className="ui-table__empty" colSpan={999}>
			<span aria-label="Loading" className="ui-btn-spinner ui-table__spinner" />
		</td>
	</tr>
);

function Table<T extends Record<string, unknown>>({
	columns,
	rows,
	rowKey,
	loading = false,
	emptyMessage = "No data available.",
	caption,
	className = "",
}: TableProps<T>) {
	const getRowKey = (row: T, index: number): string => {
		if (!rowKey) return String(index);
		if (typeof rowKey === "function") return rowKey(row);
		return String(row[rowKey]);
	};

	return (
		<div className={`ui-table-wrapper ${className}`.trim()}>
			<table className="ui-table">
				{caption && <caption className="ui-table__caption">{caption}</caption>}

				<thead>
					<tr>
						{columns.map((col) => (
							<th
								className="ui-table__th"
								key={col.key}
								style={{
									textAlign: col.align ?? "left",
									width: col.width,
								}}
							>
								{col.label}
							</th>
						))}
					</tr>
				</thead>

				<tbody>
					{loading ? (
						<Spinner />
					) : rows.length === 0 ? (
						<tr>
							<td className="ui-table__empty" colSpan={columns.length}>
								{emptyMessage}
							</td>
						</tr>
					) : (
						rows.map((row, index) => (
							<tr className="ui-table__row" key={getRowKey(row, index)}>
								{columns.map((col) => (
									<td
										className="ui-table__td"
										key={col.key}
										style={{ textAlign: col.align ?? "left" }}
									>
										{col.render
											? col.render(row[col.key], row, index)
											: (row[col.key] as ReactNode)}
									</td>
								))}
							</tr>
						))
					)}
				</tbody>
			</table>
		</div>
	);
}

export default Table;
