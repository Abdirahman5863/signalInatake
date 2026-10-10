export function LeadsStats({ leads }: { leads: any[] }) {
  const counts = [
    ['Enquiries', leads.length],
    ['Ready for discovery', leads.filter(l => l.qualification_status === 'ready_to_book').length],
    ['Needs clarification', leads.filter(l => l.qualification_status === 'manual_review').length],
    ['Won', leads.filter(l => l.pipeline_status === 'won').length],
  ]
  return <div><p className="mb-2 text-xs text-muted-foreground">Counts for this page</p><div className="grid grid-cols-2 gap-4 lg:grid-cols-4">{counts.map(([label,count]) => <div key={label} className="rounded-lg border bg-white p-5"><p className="text-sm text-muted-foreground">{label}</p><p className="mt-2 text-3xl font-semibold">{count}</p></div>)}</div></div>
}
