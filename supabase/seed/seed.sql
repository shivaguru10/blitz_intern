insert into domains (name, slug, description, duration) values
('Web Development','web-development','Build responsive web applications.','4 weeks'),
('Python Development','python-development','Automate workflows and build Python tools.','4 weeks'),
('Java Development','java-development','Create object-oriented Java applications.','4 weeks'),
('Data Science','data-science','Analyze datasets and present insights.','4 weeks'),
('AI & Machine Learning','ai-machine-learning','Train and evaluate applied ML models.','4 weeks'),
('Cyber Security','cyber-security','Practice defensive security fundamentals.','4 weeks'),
('UI/UX Design','ui-ux-design','Design user-centered product flows.','4 weeks'),
('Digital Marketing','digital-marketing','Plan and execute digital marketing campaigns.','4 weeks'),
('Cloud Computing','cloud-computing','Deploy and document cloud workloads.','4 weeks'),
('Full Stack Development','full-stack-development','Build end-to-end product features.','4 weeks')
on conflict (slug) do update set name = excluded.name, description = excluded.description, duration = excluded.duration;

insert into batches (name, start_date, end_date, is_active, registration_open) values
('June 2026 Cohort','2026-06-01','2026-06-30',true,true),
('July 2026 Cohort','2026-07-01','2026-07-31',true,true);

insert into tasks (title, description, key_features, expected_outcome, sort_order, is_mandatory, is_active)
values (
  'Mandatory: Offer Letter & LinkedIn Post',
  'Download your offer letter, post it on LinkedIn tagging Blitz Solutions, and submit the post URL here.',
  array['Download offer letter','Create a professional LinkedIn post','Submit the post URL'],
  'Start the internship with a public professional milestone.',
  0,
  true,
  true
);

insert into tasks (domain_id, title, description, key_features, expected_outcome, deadline, sort_order)
select id, 'Password Strength Analyzer',
'Develop a tool that evaluates the strength of user-entered passwords.',
array['Check password length, complexity, and uniqueness','Suggest stronger password alternatives','Optional: integrate a database to prevent reuse of old passwords'],
'Learn password security fundamentals and basic cryptography concepts.',
'2026-06-10',
1
from domains where slug = 'cyber-security';

insert into tasks (domain_id, title, description, key_features, expected_outcome, deadline, sort_order)
select id, 'Vulnerability Scanner',
'Build a simple script to detect common vulnerabilities in a web application or network.',
array['Scan for open ports or weak configurations','Identify outdated software versions','Generate a simple vulnerability report'],
'Gain practical insight into penetration testing and vulnerability assessment.',
'2026-06-17',
2
from domains where slug = 'cyber-security';

insert into tasks (domain_id, title, description, key_features, expected_outcome, deadline, sort_order)
select id, 'Phishing Email Detection Model',
'Build a machine learning model that classifies emails as phishing or safe.',
array['Train on phishing and legitimate email data','Extract URL, keyword, and sender-based features','Display accuracy and confusion matrix'],
'Understand how ML can help detect suspicious email content.',
'2026-06-24',
3
from domains where slug = 'cyber-security';

insert into tasks (domain_id, title, description, key_features, expected_outcome, deadline, sort_order)
select id, 'Secure Login System',
'Develop a secure login web app.',
array['User registration and login using hashed passwords','Basic input validation','SQL injection protection','Session management with logout','Optional two-factor authentication'],
'Build a secure authentication system and learn common login security practices.',
'2026-06-30',
4
from domains where slug = 'cyber-security';

insert into tasks (domain_id, title, description, key_features, expected_outcome, sort_order)
select id, 'Project Plan and Scope',
'Create a concise project plan for your domain project.',
array['Define problem statement','List user stories','Document milestones'],
'Learn to plan a portfolio-ready project.'
, 1 from domains where slug <> 'cyber-security';

insert into tasks (domain_id, title, description, key_features, expected_outcome, sort_order)
select id, 'Build Core Prototype',
'Build the first working version of your project.',
array['Implement core workflow','Handle validation','Document setup steps'],
'Practice shipping a usable MVP.'
, 2 from domains where slug <> 'cyber-security';

insert into tasks (domain_id, title, description, key_features, expected_outcome, sort_order)
select id, 'Final Report and Demo',
'Submit a final project report and demo link.',
array['Summarize decisions','Include screenshots','Share a demo URL'],
'Create a review-ready portfolio artifact.'
, 3 from domains where slug <> 'cyber-security';

insert into tasks (title, description, key_features, expected_outcome, sort_order, is_final_task, is_locked, is_active)
values (
  'Share Certificate on LinkedIn',
  'Post your verified certificate on LinkedIn tagging Blitz Solutions.',
  array['Download verified certificate','Share on LinkedIn','Submit public post URL'],
  'Complete the public portfolio loop for your internship.',
  999,
  true,
  true,
  true
);
