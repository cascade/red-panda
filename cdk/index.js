"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@aws-cdk/core");
const aws_redshift_1 = require("@aws-cdk/aws-redshift");
const aws_ec2_1 = require("@aws-cdk/aws-ec2");
const aws_iam_1 = require("@aws-cdk/aws-iam");
const aws_s3_1 = require("@aws-cdk/aws-s3");
const dotenv = require("dotenv");
dotenv.config();
class RedPandaTestStack extends core_1.Stack {
    constructor(scope, id) {
        super(scope, id);
        const role = new aws_iam_1.Role(this, 'RedPandaTestRole', {
            assumedBy: new aws_iam_1.ServicePrincipal('redshift.amazonaws.com')
        });
        const bucket = new aws_s3_1.Bucket(this, 'RedPandaTestBucket', {
            versioned: false,
            publicReadAccess: false,
            blockPublicAccess: aws_s3_1.BlockPublicAccess.BLOCK_ALL,
            removalPolicy: core_1.RemovalPolicy.DESTROY
        });
        bucket.grantReadWrite(role);
        const vpc = new aws_ec2_1.Vpc(this, 'RedPandaTestVPC', {});
        const sg = new aws_ec2_1.SecurityGroup(this, 'RedPandaTestSecurityGroup', {
            vpc: vpc
        });
        sg.connections.allowFromAnyIpv4(aws_ec2_1.Port.tcp(5439));
        sg.node.addDependency(vpc);
        const { subnetIds } = vpc.selectSubnets({ subnetType: aws_ec2_1.SubnetType.PUBLIC });
        const subnetGroup = new aws_redshift_1.CfnClusterSubnetGroup(this, 'RedPandaTestSubnets', {
            description: `Subnets for Redshift cluster`,
            subnetIds
        });
        subnetGroup.applyRemovalPolicy(core_1.RemovalPolicy.RETAIN, {
            applyToUpdateReplacePolicy: true
        });
        const cluster = new aws_redshift_1.CfnCluster(this, 'RedPandaTestRedshift', {
            masterUsername: process.env.REDSHIFT_USERNAME || '',
            masterUserPassword: process.env.REDSHIFT_PASSWORD || '',
            dbName: process.env.REDSHIFT_DB || '',
            clusterType: 'single-node',
            port: parseInt(process.env.REDSHIFT_PORT || '5439'),
            nodeType: 'dc2.large',
            iamRoles: [role.roleArn],
            publiclyAccessible: true,
            vpcSecurityGroupIds: [sg.securityGroupId],
            clusterSubnetGroupName: subnetGroup.ref
        });
        cluster.node.addDependency(sg);
    }
}
exports.RedPandaTestStack = RedPandaTestStack;
const app = new core_1.App();
new RedPandaTestStack(app, 'RedPandaTestStack');
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHdDQUF5RDtBQUN6RCx3REFBeUU7QUFDekUsOENBQXVFO0FBQ3ZFLDhDQUF5RDtBQUN6RCw0Q0FBMkQ7QUFDM0QsaUNBQWdDO0FBRWhDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQTtBQUVmLE1BQWEsaUJBQWtCLFNBQVEsWUFBSztJQUMxQyxZQUFZLEtBQVUsRUFBRSxFQUFVO1FBQ2hDLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUE7UUFFaEIsTUFBTSxJQUFJLEdBQUcsSUFBSSxjQUFJLENBQUMsSUFBSSxFQUFFLGtCQUFrQixFQUFFO1lBQzlDLFNBQVMsRUFBRSxJQUFJLDBCQUFnQixDQUFDLHdCQUF3QixDQUFDO1NBQzFELENBQUMsQ0FBQTtRQUVGLE1BQU0sTUFBTSxHQUFHLElBQUksZUFBTSxDQUFDLElBQUksRUFBRSxvQkFBb0IsRUFBRTtZQUNwRCxTQUFTLEVBQUUsS0FBSztZQUNoQixnQkFBZ0IsRUFBRSxLQUFLO1lBQ3ZCLGlCQUFpQixFQUFFLDBCQUFpQixDQUFDLFNBQVM7WUFDOUMsYUFBYSxFQUFFLG9CQUFhLENBQUMsT0FBTztTQUNyQyxDQUFDLENBQUE7UUFFRixNQUFNLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFBO1FBRTNCLE1BQU0sR0FBRyxHQUFHLElBQUksYUFBRyxDQUFDLElBQUksRUFBRSxpQkFBaUIsRUFBRSxFQUFFLENBQUMsQ0FBQTtRQUVoRCxNQUFNLEVBQUUsR0FBRyxJQUFJLHVCQUFhLENBQUMsSUFBSSxFQUFFLDJCQUEyQixFQUFFO1lBQzlELEdBQUcsRUFBRSxHQUFHO1NBQ1QsQ0FBQyxDQUFBO1FBRUYsRUFBRSxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxjQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUE7UUFDL0MsRUFBRSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUE7UUFFMUIsTUFBTSxFQUFFLFNBQVMsRUFBRSxHQUFHLEdBQUcsQ0FBQyxhQUFhLENBQUMsRUFBRSxVQUFVLEVBQUUsb0JBQVUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFBO1FBQzFFLE1BQU0sV0FBVyxHQUFHLElBQUksb0NBQXFCLENBQUMsSUFBSSxFQUFFLHFCQUFxQixFQUFFO1lBQ3pFLFdBQVcsRUFBRSw4QkFBOEI7WUFDM0MsU0FBUztTQUNWLENBQUMsQ0FBQTtRQUVGLFdBQVcsQ0FBQyxrQkFBa0IsQ0FBQyxvQkFBYSxDQUFDLE1BQU0sRUFBRTtZQUNuRCwwQkFBMEIsRUFBRSxJQUFJO1NBQ2pDLENBQUMsQ0FBQTtRQUVGLE1BQU0sT0FBTyxHQUFHLElBQUkseUJBQVUsQ0FBQyxJQUFJLEVBQUUsc0JBQXNCLEVBQUU7WUFDM0QsY0FBYyxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLElBQUksRUFBRTtZQUNuRCxrQkFBa0IsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLGlCQUFpQixJQUFJLEVBQUU7WUFDdkQsTUFBTSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsV0FBVyxJQUFJLEVBQUU7WUFDckMsV0FBVyxFQUFFLGFBQWE7WUFDMUIsSUFBSSxFQUFFLFFBQVEsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLGFBQWEsSUFBSSxNQUFNLENBQUM7WUFDbkQsUUFBUSxFQUFFLFdBQVc7WUFDckIsUUFBUSxFQUFFLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQztZQUN4QixrQkFBa0IsRUFBRSxJQUFJO1lBQ3hCLG1CQUFtQixFQUFFLENBQUMsRUFBRSxDQUFDLGVBQWUsQ0FBQztZQUN6QyxzQkFBc0IsRUFBRSxXQUFXLENBQUMsR0FBRztTQUN4QyxDQUFDLENBQUE7UUFFRixPQUFPLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxFQUFFLENBQUMsQ0FBQTtJQUNoQyxDQUFDO0NBQ0Y7QUFuREQsOENBbURDO0FBRUQsTUFBTSxHQUFHLEdBQUcsSUFBSSxVQUFHLEVBQUUsQ0FBQTtBQUNyQixJQUFJLGlCQUFpQixDQUFDLEdBQUcsRUFBRSxtQkFBbUIsQ0FBQyxDQUFBO0FBQy9DLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFwcCwgU3RhY2ssIFJlbW92YWxQb2xpY3kgfSBmcm9tICdAYXdzLWNkay9jb3JlJ1xuaW1wb3J0IHsgQ2ZuQ2x1c3RlciwgQ2ZuQ2x1c3RlclN1Ym5ldEdyb3VwIH0gZnJvbSAnQGF3cy1jZGsvYXdzLXJlZHNoaWZ0J1xuaW1wb3J0IHsgVnBjLCBTZWN1cml0eUdyb3VwLCBQb3J0LCBTdWJuZXRUeXBlIH0gZnJvbSAnQGF3cy1jZGsvYXdzLWVjMidcbmltcG9ydCB7IFJvbGUsIFNlcnZpY2VQcmluY2lwYWwgfSBmcm9tICdAYXdzLWNkay9hd3MtaWFtJ1xuaW1wb3J0IHsgQnVja2V0LCBCbG9ja1B1YmxpY0FjY2VzcyB9IGZyb20gJ0Bhd3MtY2RrL2F3cy1zMydcbmltcG9ydCAqIGFzIGRvdGVudiBmcm9tICdkb3RlbnYnXG5cbmRvdGVudi5jb25maWcoKVxuXG5leHBvcnQgY2xhc3MgUmVkUGFuZGFUZXN0U3RhY2sgZXh0ZW5kcyBTdGFjayB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBBcHAsIGlkOiBzdHJpbmcpIHtcbiAgICBzdXBlcihzY29wZSwgaWQpXG5cbiAgICBjb25zdCByb2xlID0gbmV3IFJvbGUodGhpcywgJ1JlZFBhbmRhVGVzdFJvbGUnLCB7XG4gICAgICBhc3N1bWVkQnk6IG5ldyBTZXJ2aWNlUHJpbmNpcGFsKCdyZWRzaGlmdC5hbWF6b25hd3MuY29tJylcbiAgICB9KVxuXG4gICAgY29uc3QgYnVja2V0ID0gbmV3IEJ1Y2tldCh0aGlzLCAnUmVkUGFuZGFUZXN0QnVja2V0Jywge1xuICAgICAgdmVyc2lvbmVkOiBmYWxzZSxcbiAgICAgIHB1YmxpY1JlYWRBY2Nlc3M6IGZhbHNlLFxuICAgICAgYmxvY2tQdWJsaWNBY2Nlc3M6IEJsb2NrUHVibGljQWNjZXNzLkJMT0NLX0FMTCxcbiAgICAgIHJlbW92YWxQb2xpY3k6IFJlbW92YWxQb2xpY3kuREVTVFJPWVxuICAgIH0pXG5cbiAgICBidWNrZXQuZ3JhbnRSZWFkV3JpdGUocm9sZSlcblxuICAgIGNvbnN0IHZwYyA9IG5ldyBWcGModGhpcywgJ1JlZFBhbmRhVGVzdFZQQycsIHt9KVxuXG4gICAgY29uc3Qgc2cgPSBuZXcgU2VjdXJpdHlHcm91cCh0aGlzLCAnUmVkUGFuZGFUZXN0U2VjdXJpdHlHcm91cCcsIHtcbiAgICAgIHZwYzogdnBjXG4gICAgfSlcblxuICAgIHNnLmNvbm5lY3Rpb25zLmFsbG93RnJvbUFueUlwdjQoUG9ydC50Y3AoNTQzOSkpXG4gICAgc2cubm9kZS5hZGREZXBlbmRlbmN5KHZwYylcblxuICAgIGNvbnN0IHsgc3VibmV0SWRzIH0gPSB2cGMuc2VsZWN0U3VibmV0cyh7IHN1Ym5ldFR5cGU6IFN1Ym5ldFR5cGUuUFVCTElDIH0pXG4gICAgY29uc3Qgc3VibmV0R3JvdXAgPSBuZXcgQ2ZuQ2x1c3RlclN1Ym5ldEdyb3VwKHRoaXMsICdSZWRQYW5kYVRlc3RTdWJuZXRzJywge1xuICAgICAgZGVzY3JpcHRpb246IGBTdWJuZXRzIGZvciBSZWRzaGlmdCBjbHVzdGVyYCxcbiAgICAgIHN1Ym5ldElkc1xuICAgIH0pXG5cbiAgICBzdWJuZXRHcm91cC5hcHBseVJlbW92YWxQb2xpY3koUmVtb3ZhbFBvbGljeS5SRVRBSU4sIHtcbiAgICAgIGFwcGx5VG9VcGRhdGVSZXBsYWNlUG9saWN5OiB0cnVlXG4gICAgfSlcblxuICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgQ2ZuQ2x1c3Rlcih0aGlzLCAnUmVkUGFuZGFUZXN0UmVkc2hpZnQnLCB7XG4gICAgICBtYXN0ZXJVc2VybmFtZTogcHJvY2Vzcy5lbnYuUkVEU0hJRlRfVVNFUk5BTUUgfHwgJycsXG4gICAgICBtYXN0ZXJVc2VyUGFzc3dvcmQ6IHByb2Nlc3MuZW52LlJFRFNISUZUX1BBU1NXT1JEIHx8ICcnLFxuICAgICAgZGJOYW1lOiBwcm9jZXNzLmVudi5SRURTSElGVF9EQiB8fCAnJyxcbiAgICAgIGNsdXN0ZXJUeXBlOiAnc2luZ2xlLW5vZGUnLFxuICAgICAgcG9ydDogcGFyc2VJbnQocHJvY2Vzcy5lbnYuUkVEU0hJRlRfUE9SVCB8fCAnNTQzOScpLFxuICAgICAgbm9kZVR5cGU6ICdkYzIubGFyZ2UnLFxuICAgICAgaWFtUm9sZXM6IFtyb2xlLnJvbGVBcm5dLFxuICAgICAgcHVibGljbHlBY2Nlc3NpYmxlOiB0cnVlLFxuICAgICAgdnBjU2VjdXJpdHlHcm91cElkczogW3NnLnNlY3VyaXR5R3JvdXBJZF0sXG4gICAgICBjbHVzdGVyU3VibmV0R3JvdXBOYW1lOiBzdWJuZXRHcm91cC5yZWZcbiAgICB9KVxuXG4gICAgY2x1c3Rlci5ub2RlLmFkZERlcGVuZGVuY3koc2cpXG4gIH1cbn1cblxuY29uc3QgYXBwID0gbmV3IEFwcCgpXG5uZXcgUmVkUGFuZGFUZXN0U3RhY2soYXBwLCAnUmVkUGFuZGFUZXN0U3RhY2snKVxuYXBwLnN5bnRoKClcbiJdfQ==