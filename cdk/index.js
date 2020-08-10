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
            dbName: 'redpandatestdb',
            clusterType: 'single-node',
            port: 5439,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHdDQUF5RDtBQUN6RCx3REFBeUU7QUFDekUsOENBQXVFO0FBQ3ZFLDhDQUF5RDtBQUN6RCw0Q0FBMkQ7QUFDM0QsaUNBQWdDO0FBRWhDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQTtBQUVmLE1BQWEsaUJBQWtCLFNBQVEsWUFBSztJQUMxQyxZQUFZLEtBQVUsRUFBRSxFQUFVO1FBQ2hDLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUE7UUFFaEIsTUFBTSxJQUFJLEdBQUcsSUFBSSxjQUFJLENBQUMsSUFBSSxFQUFFLGtCQUFrQixFQUFFO1lBQzlDLFNBQVMsRUFBRSxJQUFJLDBCQUFnQixDQUFDLHdCQUF3QixDQUFDO1NBQzFELENBQUMsQ0FBQTtRQUVGLE1BQU0sTUFBTSxHQUFHLElBQUksZUFBTSxDQUFDLElBQUksRUFBRSxvQkFBb0IsRUFBRTtZQUNwRCxTQUFTLEVBQUUsS0FBSztZQUNoQixnQkFBZ0IsRUFBRSxLQUFLO1lBQ3ZCLGlCQUFpQixFQUFFLDBCQUFpQixDQUFDLFNBQVM7WUFDOUMsYUFBYSxFQUFFLG9CQUFhLENBQUMsT0FBTztTQUNyQyxDQUFDLENBQUE7UUFFRixNQUFNLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFBO1FBRTNCLE1BQU0sR0FBRyxHQUFHLElBQUksYUFBRyxDQUFDLElBQUksRUFBRSxpQkFBaUIsRUFBRSxFQUFFLENBQUMsQ0FBQTtRQUVoRCxNQUFNLEVBQUUsR0FBRyxJQUFJLHVCQUFhLENBQUMsSUFBSSxFQUFFLDJCQUEyQixFQUFFO1lBQzlELEdBQUcsRUFBRSxHQUFHO1NBQ1QsQ0FBQyxDQUFBO1FBRUYsRUFBRSxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxjQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUE7UUFDL0MsRUFBRSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUE7UUFFMUIsTUFBTSxFQUFFLFNBQVMsRUFBRSxHQUFHLEdBQUcsQ0FBQyxhQUFhLENBQUMsRUFBRSxVQUFVLEVBQUUsb0JBQVUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFBO1FBQzFFLE1BQU0sV0FBVyxHQUFHLElBQUksb0NBQXFCLENBQUMsSUFBSSxFQUFFLHFCQUFxQixFQUFFO1lBQ3pFLFdBQVcsRUFBRSw4QkFBOEI7WUFDM0MsU0FBUztTQUNWLENBQUMsQ0FBQTtRQUVGLFdBQVcsQ0FBQyxrQkFBa0IsQ0FBQyxvQkFBYSxDQUFDLE1BQU0sRUFBRTtZQUNuRCwwQkFBMEIsRUFBRSxJQUFJO1NBQ2pDLENBQUMsQ0FBQTtRQUVGLE1BQU0sT0FBTyxHQUFHLElBQUkseUJBQVUsQ0FBQyxJQUFJLEVBQUUsc0JBQXNCLEVBQUU7WUFDM0QsY0FBYyxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLElBQUksRUFBRTtZQUNuRCxrQkFBa0IsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLGlCQUFpQixJQUFJLEVBQUU7WUFDdkQsTUFBTSxFQUFFLGdCQUFnQjtZQUN4QixXQUFXLEVBQUUsYUFBYTtZQUMxQixJQUFJLEVBQUUsSUFBSTtZQUNWLFFBQVEsRUFBRSxXQUFXO1lBQ3JCLFFBQVEsRUFBRSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUM7WUFDeEIsa0JBQWtCLEVBQUUsSUFBSTtZQUN4QixtQkFBbUIsRUFBRSxDQUFDLEVBQUUsQ0FBQyxlQUFlLENBQUM7WUFDekMsc0JBQXNCLEVBQUUsV0FBVyxDQUFDLEdBQUc7U0FDeEMsQ0FBQyxDQUFBO1FBRUYsT0FBTyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsRUFBRSxDQUFDLENBQUE7SUFDaEMsQ0FBQztDQUNGO0FBbkRELDhDQW1EQztBQUVELE1BQU0sR0FBRyxHQUFHLElBQUksVUFBRyxFQUFFLENBQUE7QUFDckIsSUFBSSxpQkFBaUIsQ0FBQyxHQUFHLEVBQUUsbUJBQW1CLENBQUMsQ0FBQTtBQUMvQyxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBcHAsIFN0YWNrLCBSZW1vdmFsUG9saWN5IH0gZnJvbSAnQGF3cy1jZGsvY29yZSdcbmltcG9ydCB7IENmbkNsdXN0ZXIsIENmbkNsdXN0ZXJTdWJuZXRHcm91cCB9IGZyb20gJ0Bhd3MtY2RrL2F3cy1yZWRzaGlmdCdcbmltcG9ydCB7IFZwYywgU2VjdXJpdHlHcm91cCwgUG9ydCwgU3VibmV0VHlwZSB9IGZyb20gJ0Bhd3MtY2RrL2F3cy1lYzInXG5pbXBvcnQgeyBSb2xlLCBTZXJ2aWNlUHJpbmNpcGFsIH0gZnJvbSAnQGF3cy1jZGsvYXdzLWlhbSdcbmltcG9ydCB7IEJ1Y2tldCwgQmxvY2tQdWJsaWNBY2Nlc3MgfSBmcm9tICdAYXdzLWNkay9hd3MtczMnXG5pbXBvcnQgKiBhcyBkb3RlbnYgZnJvbSAnZG90ZW52J1xuXG5kb3RlbnYuY29uZmlnKClcblxuZXhwb3J0IGNsYXNzIFJlZFBhbmRhVGVzdFN0YWNrIGV4dGVuZHMgU3RhY2sge1xuICBjb25zdHJ1Y3RvcihzY29wZTogQXBwLCBpZDogc3RyaW5nKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkKVxuXG4gICAgY29uc3Qgcm9sZSA9IG5ldyBSb2xlKHRoaXMsICdSZWRQYW5kYVRlc3RSb2xlJywge1xuICAgICAgYXNzdW1lZEJ5OiBuZXcgU2VydmljZVByaW5jaXBhbCgncmVkc2hpZnQuYW1hem9uYXdzLmNvbScpXG4gICAgfSlcblxuICAgIGNvbnN0IGJ1Y2tldCA9IG5ldyBCdWNrZXQodGhpcywgJ1JlZFBhbmRhVGVzdEJ1Y2tldCcsIHtcbiAgICAgIHZlcnNpb25lZDogZmFsc2UsXG4gICAgICBwdWJsaWNSZWFkQWNjZXNzOiBmYWxzZSxcbiAgICAgIGJsb2NrUHVibGljQWNjZXNzOiBCbG9ja1B1YmxpY0FjY2Vzcy5CTE9DS19BTEwsXG4gICAgICByZW1vdmFsUG9saWN5OiBSZW1vdmFsUG9saWN5LkRFU1RST1lcbiAgICB9KVxuXG4gICAgYnVja2V0LmdyYW50UmVhZFdyaXRlKHJvbGUpXG5cbiAgICBjb25zdCB2cGMgPSBuZXcgVnBjKHRoaXMsICdSZWRQYW5kYVRlc3RWUEMnLCB7fSlcblxuICAgIGNvbnN0IHNnID0gbmV3IFNlY3VyaXR5R3JvdXAodGhpcywgJ1JlZFBhbmRhVGVzdFNlY3VyaXR5R3JvdXAnLCB7XG4gICAgICB2cGM6IHZwY1xuICAgIH0pXG5cbiAgICBzZy5jb25uZWN0aW9ucy5hbGxvd0Zyb21BbnlJcHY0KFBvcnQudGNwKDU0MzkpKVxuICAgIHNnLm5vZGUuYWRkRGVwZW5kZW5jeSh2cGMpXG5cbiAgICBjb25zdCB7IHN1Ym5ldElkcyB9ID0gdnBjLnNlbGVjdFN1Ym5ldHMoeyBzdWJuZXRUeXBlOiBTdWJuZXRUeXBlLlBVQkxJQyB9KVxuICAgIGNvbnN0IHN1Ym5ldEdyb3VwID0gbmV3IENmbkNsdXN0ZXJTdWJuZXRHcm91cCh0aGlzLCAnUmVkUGFuZGFUZXN0U3VibmV0cycsIHtcbiAgICAgIGRlc2NyaXB0aW9uOiBgU3VibmV0cyBmb3IgUmVkc2hpZnQgY2x1c3RlcmAsXG4gICAgICBzdWJuZXRJZHNcbiAgICB9KVxuXG4gICAgc3VibmV0R3JvdXAuYXBwbHlSZW1vdmFsUG9saWN5KFJlbW92YWxQb2xpY3kuUkVUQUlOLCB7XG4gICAgICBhcHBseVRvVXBkYXRlUmVwbGFjZVBvbGljeTogdHJ1ZVxuICAgIH0pXG5cbiAgICBjb25zdCBjbHVzdGVyID0gbmV3IENmbkNsdXN0ZXIodGhpcywgJ1JlZFBhbmRhVGVzdFJlZHNoaWZ0Jywge1xuICAgICAgbWFzdGVyVXNlcm5hbWU6IHByb2Nlc3MuZW52LlJFRFNISUZUX1VTRVJOQU1FIHx8ICcnLFxuICAgICAgbWFzdGVyVXNlclBhc3N3b3JkOiBwcm9jZXNzLmVudi5SRURTSElGVF9QQVNTV09SRCB8fCAnJyxcbiAgICAgIGRiTmFtZTogJ3JlZHBhbmRhdGVzdGRiJyxcbiAgICAgIGNsdXN0ZXJUeXBlOiAnc2luZ2xlLW5vZGUnLFxuICAgICAgcG9ydDogNTQzOSxcbiAgICAgIG5vZGVUeXBlOiAnZGMyLmxhcmdlJyxcbiAgICAgIGlhbVJvbGVzOiBbcm9sZS5yb2xlQXJuXSxcbiAgICAgIHB1YmxpY2x5QWNjZXNzaWJsZTogdHJ1ZSxcbiAgICAgIHZwY1NlY3VyaXR5R3JvdXBJZHM6IFtzZy5zZWN1cml0eUdyb3VwSWRdLFxuICAgICAgY2x1c3RlclN1Ym5ldEdyb3VwTmFtZTogc3VibmV0R3JvdXAucmVmXG4gICAgfSlcblxuICAgIGNsdXN0ZXIubm9kZS5hZGREZXBlbmRlbmN5KHNnKVxuICB9XG59XG5cbmNvbnN0IGFwcCA9IG5ldyBBcHAoKVxubmV3IFJlZFBhbmRhVGVzdFN0YWNrKGFwcCwgJ1JlZFBhbmRhVGVzdFN0YWNrJylcbmFwcC5zeW50aCgpXG4iXX0=