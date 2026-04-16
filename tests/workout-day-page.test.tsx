// 👉 tipagem correta
type Session = {
  id: string;
  startedAt: string | null;
  completedAt: string | null;
};

// 👉 função testada
function getWorkoutSessionState(sessions: Session[]) {
  const inProgressSession = sessions.find(
    (session) => session.startedAt && !session.completedAt,
  );

  if (inProgressSession) {
    return {
      state: "in-progress" as const,
      sessionId: inProgressSession.id,
    };
  }

  const hasCompletedSession = sessions.some(
    (session) => !!session.completedAt,
  );

  if (hasCompletedSession) {
    return {
      state: "completed" as const,
      sessionId: null,
    };
  }

  return {
    state: "idle" as const,
    sessionId: null,
  };
}

describe("WorkoutDayPage - lógica de sessão", () => {
  it("deve retornar 'in-progress' quando existir sessão iniciada", () => {
    const sessions: Session[] = [
      {
        id: "1",
        startedAt: "2024-01-01",
        completedAt: null,
      },
    ];

    const result = getWorkoutSessionState(sessions);

    expect(result.state).toBe("in-progress");
    expect(result.sessionId).toBe("1");
  });

  it("deve retornar 'completed' quando existir sessão finalizada", () => {
    const sessions: Session[] = [
      {
        id: "1",
        startedAt: "2024-01-01",
        completedAt: "2024-01-02",
      },
    ];

    const result = getWorkoutSessionState(sessions);

    expect(result.state).toBe("completed");
    expect(result.sessionId).toBeNull();
  });

  it("deve retornar 'idle' quando não houver sessões", () => {
    const sessions: Session[] = [];

    const result = getWorkoutSessionState(sessions);

    expect(result.state).toBe("idle");
    expect(result.sessionId).toBeNull();
  });

  it("deve priorizar 'in-progress' mesmo com sessão concluída", () => {
    const sessions: Session[] = [
      {
        id: "1",
        startedAt: "2024-01-01",
        completedAt: "2024-01-02",
      },
      {
        id: "2",
        startedAt: "2024-01-03",
        completedAt: null,
      },
    ];

    const result = getWorkoutSessionState(sessions);

    expect(result.state).toBe("in-progress");
    expect(result.sessionId).toBe("2");
  });
});