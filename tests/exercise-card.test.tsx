import { render, screen } from "@testing-library/react";
import { ExerciseCard } from "@/components/workout-day/exercise-card";
import type { GetWorkoutDay200ExercisesItem } from "@/app/_lib/api/fetch-generated";

// 👉 mock do botão para evitar erro de dependência
jest.mock("@/components/chat/exercise-chat-button", () => ({
  ExerciseChatButton: () => <div>ChatButton</div>,
}));

describe("ExerciseCard", () => {
  const mockExercise: GetWorkoutDay200ExercisesItem = {
    id: "1",
    name: "Supino reto",
    sets: 3,
    reps: 10,
    restTimeInSeconds: 60,
    order: 1,
    workoutDayId: "day-1",
  };

  it("deve renderizar o nome do exercício", () => {
    render(<ExerciseCard exercise={mockExercise} />);

    expect(screen.getByText("Supino reto")).toBeInTheDocument();
  });

  it("deve renderizar séries", () => {
    render(<ExerciseCard exercise={mockExercise} />);

    expect(screen.getByText("3 series")).toBeInTheDocument();
  });

  it("deve renderizar reps", () => {
    render(<ExerciseCard exercise={mockExercise} />);

    expect(screen.getByText("10 reps")).toBeInTheDocument();
  });

  it("deve renderizar tempo de descanso", () => {
    render(<ExerciseCard exercise={mockExercise} />);

    expect(screen.getByText("60S")).toBeInTheDocument();
  });
});