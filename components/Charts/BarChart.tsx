'use client';

import { formatCurrency } from '@/utils/formatFns';
import { format, monthsToQuarters } from 'date-fns';
import { useTheme } from 'next-themes';
import {
	Bar,
	BarChart as BarChartElement,
	CartesianGrid,
	Legend,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts';
import ChartContainer from './ChartContainer';

interface BarChartProps {
	title: string;
	showLegend?: boolean;
	datasetCurrency: string;
	data: {
		data: { x: Date; currency: string }[];
		barData: {
			count: number;
			categories: string[];
		};
	};
	className?: string;
}

const BarChart = ({
	title,
	data,
	datasetCurrency,
	className,
	showLegend = false,
}: BarChartProps) => {
	const { systemTheme, theme } = useTheme();
	const computedTheme = theme === 'system' ? systemTheme : theme;

	const limeColor = computedTheme === 'dark' ? '#a3e635' : '#3f6212';
	const complementaryColor = computedTheme === 'dark' ? '#AE84F0' : '#351262';
	const mutedColor = computedTheme === 'dark' ? '#1e293b' : '#e2e8f0';
	const textColor = computedTheme === 'dark' ? '#f8fafc' : '#020617';

	const fillBar = (barIndex: number) => {
		// Alternate colors in a sequence.
		if (barIndex % 3 === 0) {
			return limeColor;
		} else if ((barIndex - 1) % 3 === 0) {
			return complementaryColor;
		} else {
			return textColor;
		}
	};

	return (
		<ChartContainer title={title} className={className} hasLegend={showLegend}>
			<ResponsiveContainer width="100%" height={350}>
				<BarChartElement data={data.data}>
					<CartesianGrid stroke={mutedColor} vertical={false} />
					<XAxis
						dataKey="x"
						stroke={textColor}
						fontSize={12}
						tickFormatter={(value) =>
							`Q${monthsToQuarters(new Date(value).getMonth() + 1)} ${format(
								value,
								'yy'
							)}`
						}
						tickLine={false}
						axisLine={{ stroke: mutedColor }}
					/>
					<YAxis
						stroke={textColor}
						fontSize={12}
						tickFormatter={(value) => `${formatCurrency(value, datasetCurrency, 0)}`}
						tickCount={9}
						axisLine={false}
						tickLine={false}
					/>

					{Array.from({ length: data.barData.count }).map((_, i) => (
						<Bar
							name={data.barData?.categories?.[i] || `dataset ${i + 1}`}
							key={`${title}-bar-${i}`}
							dataKey={`y${i}`}
							fill={fillBar(i)}
							radius={[4, 4, 0, 0]}
						/>
					))}

					{showLegend && <Legend verticalAlign="top" height={36} />}

					<Tooltip
						cursor={false}
						separator=": "
						labelFormatter={(value) => `${format(value, 'MM/dd/yyyy')}`}
						formatter={(value: number, payload, props) => {
							const formattedValue = formatCurrency(value, props.payload.currency);

							return [formattedValue, `${props?.name}`];
						}}
						contentStyle={{
							borderRadius: '6px',
							backgroundColor: computedTheme === 'dark' ? '#020617' : '#fff',
							borderColor: mutedColor,
						}}
					/>
				</BarChartElement>
			</ResponsiveContainer>
		</ChartContainer>
	);
};

export default BarChart;
