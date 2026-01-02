export function mapQuestToGanttTask(quest) {
  if (!quest.start_date || !quest.deadline) return null;

  return {
    id: `quest-${quest.id}`,
    name: quest.title,

    start: new Date(quest.start_date),
    end: new Date(quest.deadline),

    type: "task",

    progress: quest.status === "completed" ? 100 : 0,
  };
}
