Workspace-specific Copilot checklist.

- [x] Verify that the copilot-instructions.md file in the .github directory is created. — File recreated after scaffolding overwrote initial structure.

- [x] Clarify Project Requirements — Build a Next.js 14 + TypeScript + Tailwind site with MongoDB (Mongoose) and Cloudinary per user request.
	- Ask for project type, language, and frameworks if not specified. Skip if already provided.

- [x] Scaffold the Project — Manual scaffold completed with Next.js structure, dependencies, and initial source files.
	- Ensure that the previous step has been marked as completed.
	- Call project setup tool with projectType parameter.
	- Run scaffolding command to create project files and folders.
	- Use '.' as the working directory.
	- If no appropriate projectType is available, search documentation using available tools.
	- Otherwise, create the project structure manually using available file creation tools.

- [x] Customize the Project — Implemented site sections, API routes, models, and utilities aligned with IEEE BUBT SB needs.
	- Verify that all previous steps have been completed successfully and you have marked the step as completed.
	- Develop a plan to modify codebase according to user requirements.
	- Apply modifications using appropriate tools and user-provided references.
	- Skip this step for "Hello World" projects.

- [x] Install Required Extensions — No additional extensions requested; skipping installation.
	- ONLY install extensions provided mentioned in the get_project_setup_info. Skip this step otherwise and mark as completed.

- [x] Compile the Project — `npm run build` succeeds; database connection logs warn until MongoDB env vars are set.
	- Verify that all previous steps have been completed.
	- Install any missing dependencies.
	- Run diagnostics and resolve any issues.
	- Check for markdown files in project folder for relevant instructions on how to do this.

- [x] Create and Run Task — No VS Code tasks required beyond npm scripts; skipping custom task setup.
	- Verify that all previous steps have been completed.
	- Check https://code.visualstudio.com/docs/debugtest/tasks to determine if the project needs a task. If so, use the create_and_run_task to create and launch a task based on package.json, README.md, and project structure.
	- Skip this step otherwise.

- [ ] Launch the Project
	- Verify that all previous steps have been completed.
	- Prompt user for debug mode, launch only if confirmed.

 - [x] Ensure Documentation is Complete
 	- Verified that all previous steps have been completed.
 	- README.md and the copilot-instructions.md file exist and contain current project information (including membership applications).
 	- Confirmed there are no HTML comments in the copilot-instructions.md file.

Work through each checklist item systematically.
Keep communication concise and focused.
Follow development best practices.
