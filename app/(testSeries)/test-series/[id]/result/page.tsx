import ResultClient from "@/components/(Result)/ResultClient";

export default async function ResultPage({ params }: { params: Promise<{ id: string }> }) {
  // Await the params correctly with the updated Promise type above
  const { id } = await params;
  
  // Note: Handle the authentication check directly inside <ResultClient /> 
  // by calling your custom `useUser()` hook.
  
  return (
    <ResultClient
      testId={id}
    />
  );
}