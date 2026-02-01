import { ErrorBoundary } from "react-error-boundary";
import { Suspense } from "react";
import { prefetchWorkflows } from "@/features/workflows/servers/prefetch";
import { requireAuth } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";
import WorkflowsList, {
	WorkflowsContainer,
} from "@/features/workflows/components/workflows";
import type { SearchParams } from "nuqs/server";
import { workflowsParamsLoader } from "@/features/workflows/servers/params-loader";

type Props = {
	searchParams: Promise<SearchParams>;
};
export default async function Page({ searchParams }: Props) {
	await requireAuth();
	const params = await workflowsParamsLoader(searchParams);

	prefetchWorkflows(params);

	return (
		<WorkflowsContainer>
			<HydrateClient>
				<ErrorBoundary fallback={<p>Error</p>}>
					<Suspense fallback={<p>Loading...</p>}>
						<WorkflowsList />
					</Suspense>
				</ErrorBoundary>
			</HydrateClient>
		</WorkflowsContainer>
	);
}
