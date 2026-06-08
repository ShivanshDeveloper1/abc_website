import ResultClient from "@/components/(Result)/ResultClient";

export default async function ResultPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  
  // Note: Handle the authentication check directly inside <ResultClient /> 
  // by calling your custom `useUser()` hook.
  
  return (
    <ResultClient
      testId={id}
    />
  );
}