## MODIFIED Requirements

### Requirement: Initializer performs optional post-setup actions and reports outcome
The system SHALL allow the user to opt into dependency installation and git initialization, it SHALL create the generated repository with `main` as the initial branch whenever git initialization is selected, and it SHALL print a final summary that distinguishes completed scaffold work from any optional post-setup failures.

#### Scenario: User enables post-setup actions
- **WHEN** the user opts into dependency installation and git initialization
- **THEN** the system runs those actions after scaffold generation and includes the resulting status in the final summary

#### Scenario: Git initialization creates a repository on main
- **WHEN** the user opts into git initialization for a newly generated project
- **THEN** the system initializes the repository so the current local branch is `main` instead of inheriting the machine-specific Git default branch name

#### Scenario: Post-setup action fails after scaffold generation
- **WHEN** the scaffold has already been generated and a selected post-setup action fails
- **THEN** the system preserves the generated project, reports which step failed, and prints next steps that let the user continue manually
