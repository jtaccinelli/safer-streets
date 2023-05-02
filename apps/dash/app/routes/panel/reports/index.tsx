import type { FormEventHandler } from "react";

import {
  Form,
  useLoaderData,
  useSearchParams,
  useSubmit,
} from "@remix-run/react";

import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";

import type { ReportFull } from "@safer-streets/db";
import { SEVERITIES, SupabaseClient, TYPES } from "@safer-streets/db";

import { formatMetadata } from "~/utils/seo";
import { getPageRange } from "~/utils/data";

import { PageHeader } from "~/components/globals/page-header";
import { ReportTile } from "~/components/modules/report-tile";
import { Pagination } from "~/components/elements/pagination";

export const meta = () => {
  return formatMetadata({
    title: "Report",
  });
};

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);

  const page = url.searchParams.get("page") ?? "1";
  const sortBy = url.searchParams.get("sort_by") ?? "newest";
  const type = url.searchParams.get("type") ?? "all";
  const severity = url.searchParams.get("severity") ?? "all";
  const textSearch = url.searchParams.get("query");

  const [from, to] = getPageRange(20, parseInt(page));

  const select = `
    *, 
    type:type_handle(
      handle,
      title
    ), 
    content:content_id(
      severity:severity_handle(
        title
      ), 
      details
    )
  `;

  const query = SupabaseClient.from("reports")
    .select(select, { count: "exact" })
    .range(from, to);

  if (sortBy === "created_recently") {
    query.order("created_at", { ascending: true });
  }

  if (sortBy === "updated_recently") {
    query.order("updated_at", { ascending: true });
  }

  if (sortBy === "id") {
    query.order("id", { ascending: true });
  }

  if (type !== "all") {
    query.eq("type_handle", type);
  }

  if (severity !== "all") {
    query.eq("content.severity_handle", severity);
  }

  if (textSearch) {
    query.textSearch("content.details", textSearch);
  }

  const { data, error, count } = await query;

  if (error) throw new Error(error.message);

  const pageCount = count ? Math.ceil(count / 20) : 1;

  return json({
    reports: data,
    pageCount,
  });
};

export default function Page() {
  const { reports } = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();

  const submit = useSubmit();

  const handleChange: FormEventHandler<HTMLFormElement> = (event) => {
    submit(event.currentTarget, { replace: true });
  };

  return (
    <div className="flex h-[100vh] flex-col divide-y divide-gray-100 overflow-y-scroll">
      <PageHeader title="Reports">
        <Form onChange={handleChange} className="flex gap-4">
          <div className="flex w-full flex-col gap-2">
            <label htmlFor="type">Type</label>
            <select
              name="type"
              defaultValue={searchParams?.get("type") ?? undefined}
              className="rounded bg-gray-100 p-4 capitalize"
            >
              <option value="all">all</option>
              {Object.values(TYPES).map((handle) => (
                <option key={handle} value={handle}>
                  {handle}
                </option>
              ))}
            </select>
          </div>
          <div className="flex w-full flex-col gap-2">
            <label htmlFor="severity">Severity</label>
            <select
              name="severity"
              defaultValue={searchParams?.get("severity") ?? undefined}
              className="rounded bg-gray-100 p-4 capitalize"
            >
              <option value="all">all</option>
              {Object.values(SEVERITIES).map((handle) => (
                <option key={handle} value={handle}>
                  {handle}
                </option>
              ))}
            </select>
          </div>
          <div className="flex w-full flex-col gap-2">
            <label htmlFor="query">Search</label>
            <input
              name="query"
              type="search"
              defaultValue={searchParams?.get("query") ?? ""}
              className="rounded bg-gray-100 p-4"
            />
          </div>
          <div className="flex w-full flex-col gap-2">
            <label htmlFor="sort_by">Sort By</label>
            <select
              name="sort_by"
              defaultValue={searchParams?.get("sort_by") ?? undefined}
              className="rounded bg-gray-100 p-4"
            >
              <option value="created_recently">Created Most Recently</option>
              <option value="updated_recently">Updated Most Recently</option>
              <option value="id">ID</option>
            </select>
          </div>
        </Form>
      </PageHeader>
      <div className="p-8">
        <Pagination />
      </div>
      <div className="flex flex-col gap-2 p-4">
        {reports?.map((report: ReportFull) => (
          <ReportTile key={report.id} report={report} />
        ))}
      </div>
      <div className="p-8">
        <Pagination />
      </div>
    </div>
  );
}
