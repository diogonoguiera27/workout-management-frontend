import { test, expect } from "@playwright/test";

test("fluxo completo de treino", async ({ page }) => {
  // 1. acessar página inicial
  await page.goto("/");

  // ⚠️ se tiver login, pode redirecionar — depois tratamos isso

  // 2. ir direto para página de treino
  await page.goto("/workout-plans/1/days/1");

  // 3. verificar botão iniciar
  await expect(page.getByText("Iniciar Treino")).toBeVisible();

  // 4. clicar iniciar treino
  await page.click("text=Iniciar Treino");

  // 5. validar mudança de estado
  await expect(page.getByText("Marcar como concluido")).toBeVisible();
});