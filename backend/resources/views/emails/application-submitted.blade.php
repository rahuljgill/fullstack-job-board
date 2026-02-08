<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background-color: black;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 5px 5px 0 0;
        }
        .content {
            background-color: #f9f9f9;
            padding: 20px;
            border-radius: 0 0 5px 5px;
        }
        .job-details {
            background-color: white;
            padding: 15px;
            margin: 15px 0;
            border-left: 4px solid black;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
            color: #666;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Application Submitted Successfully!</h1>
        </div>
        
        <div class="content">
            <p>Hi {{ $user->name }},</p>
            
            <p>Your application has been successfully submitted!</p>
            
            <div class="job-details">
                <h2 style="margin-top: 0; color: black;">{{ $application->job->title }}</h2>
                <p><strong>Company:</strong> {{ $application->job->company->name }}</p>
                <p><strong>Location:</strong> {{ $application->job->location }}</p>
                <p><strong>Applied on:</strong> {{ $application->created_at->format('F j, Y') }}</p>
                <p><strong>Status:</strong> <span style="color: black;">Applied</span></p>
            </div>
            
            <p>We'll notify you when the employer reviews your application.</p>
            
            <p>Good luck!</p>
            
            <p>Best regards,<br>
            Rahul Gill</p>
        </div>
        
        <div class="footer">
            <p>This is an automated email. Please do not reply.</p>
        </div>
    </div>
</body>
</html>