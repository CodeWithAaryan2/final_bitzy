import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";

const DEFAULT_USER_ID = 1;

export const challengeRouter = createRouter({
  list: publicQuery.query(async () => {
    const db = getDb();
    const { data } = await db
      .from("challenges")
      .select("*")
      .order("solveCount", { ascending: false });
    return data ?? [];
  }),

  getBySlug: publicQuery
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const db = getDb();
      const { data, error } = await db
        .from("challenges")
        .select("*")
        .eq("slug", input.slug)
        .single();
      if (error || !data) return null;
      return data;
    }),

  submit: publicQuery
    .input(z.object({
      challengeId: z.number(),
      language: z.string(),
      sourceCode: z.string(),
      status: z.enum(["pending", "accepted", "wrong_answer", "time_limit", "runtime_error", "compilation_error"]),
      testResults: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();

      await db.from("codeSubmissions").insert({
        userId: DEFAULT_USER_ID,
        challengeId: input.challengeId,
        language: input.language,
        sourceCode: input.sourceCode,
        status: input.status,
        testResults: input.testResults || "[]",
      } as any);

      if (input.status === "accepted") {
        const { data: challenge } = await db
          .from("challenges")
          .select("solveCount")
          .eq("id", input.challengeId)
          .single();

        if (challenge) {
          await db.from("challenges")
            .update({ solveCount: (challenge.solveCount || 0) + 1 } as any)
            .eq("id", input.challengeId);

          const { data: profile } = await db
            .from("profiles")
            .select("totalChallenges")
            .eq("userId", DEFAULT_USER_ID)
            .single();

          await db.from("profiles")
            .update({ totalChallenges: (profile as any)?.totalChallenges || 0 + 1 } as any)
            .eq("userId", DEFAULT_USER_ID);
        }
      }

      return { success: true };
    }),

  mySubmissions: publicQuery
    .input(z.object({ challengeId: z.number().optional() }))
    .query(async ({ input }) => {
      const db = getDb();
      let query = db.from("codeSubmissions").select("*").eq("userId", DEFAULT_USER_ID);
      if (input.challengeId) {
        query = query.eq("challengeId", input.challengeId);
      }
      const { data } = await query;
      return data ?? [];
    }),
});
