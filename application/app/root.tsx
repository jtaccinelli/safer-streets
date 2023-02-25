import React, {useEffect} from 'react';
import {Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData,} from '@remix-run/react';
import {json} from '@remix-run/cloudflare';

import styles from '~/styles/build.css';
import icons from '~/icons/css/icons.css';

import {config} from '~/config';
import {fetchReports, fetchSeverities, fetchTypes} from '~/lib/supabase';

import {useFilterStore} from '~/hooks/filter/use-filter-store';

import Map from '~/components/organisms/map';
import MapProvider from '~/components/organisms/map/context';

import Header from '~/components/regions/header';
import Body from '~/components/regions/body';
import Footer from '~/components/regions/footer';
import Reports from '~/components/regions/reports';
import Toast from '~/components/regions/toast';


import TopBar from '~/components/molecules/top-bar';
import BottomBar from '~/components/molecules/bottom-bar';
import Controls from '~/components/molecules/controls';

export function meta() {
	return {
		charset: 'utf-8',
		title: config.seo.default.title,
		description: config.seo.default.description,
		viewport: 'width=device-width,initial-scale=1',
	};
}

export function links() {
	return [
		{rel: 'stylesheet', href: styles},
		{rel: 'stylesheet', href: icons},
		{rel: 'stylesheet', href: config.css.maplibre},
		{rel: 'stylesheet', href: config.css.fonts},
	];
}

export async function loader() {
	const [reports, types, severities] = await Promise.all([
		await fetchReports(),
		await fetchTypes(),
		await fetchSeverities()
	]);

	return json({
		reports,
		types,
		severities
	});
}

export default function App() {
	const {types, severities} = useLoaderData<typeof loader>();
	const {setSeverities, setTypes} = useFilterStore();

	useEffect(() => {
		setSeverities(severities);
		setTypes(types);
		//	eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<html lang="en">
		<head>
			<Meta/>
			<Links/>
		</head>
		<body>
		<MapProvider>
			<Outlet/>
			<div className="layer z-10">
				<Map className="absolute inset-0 h-screen w-screen">
					<Reports/>
				</Map>
			</div>
			<div className="layer pointer-events-none z-20">
				<div className="clamp mx-auto flex h-full flex-col drop-shadow-lg">
					<TopBar/>
					<Header.Container/>
					<div className="flex flex-grow justify-between overflow-hidden py-4 transition-all">
						<Toast.Container/>
						<Controls/>
					</div>
					<Body.Container/>
					<Footer.Container/>
					<BottomBar/>
				</div>
			</div>
		</MapProvider>
		<ScrollRestoration/>
		<Scripts/>
		<script
			defer
			data-domain="app.saferstreets.info"
			src={'https://plausible.io/js/script.js'}
		/>
		<LiveReload/>
		</body>
		</html>
	);
}
