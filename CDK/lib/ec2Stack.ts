import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import {Construct} from 'constructs';
import * as fs from 'fs';
import * as path from 'path';

export class EC2Stack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        // Create a VPC with a single public subnet
        const vpc = new ec2.Vpc(this, 'MinimalVpc', {
            maxAzs: 1,
            subnetConfiguration: [
                {
                    cidrMask: 24,
                    name: 'public',
                    subnetType: ec2.SubnetType.PUBLIC,
                }
            ],
            natGateways: 0, // No NAT gateways to avoid charges
        });

        // Create a security group for the EC2 instance
        const securityGroup = new ec2.SecurityGroup(this, 'MinimalSecurityGroup', {
            vpc,
            description: 'Allow SSH and HTTP/HTTPS',
            allowAllOutbound: true,
        });

        // Allow SSH access from anywhere
        securityGroup.addIngressRule(
            ec2.Peer.anyIpv4(),
            ec2.Port.tcp(22),
            'Allow SSH from anywhere'
        );

        // Allow HTTP access from anywhere
        securityGroup.addIngressRule(
            ec2.Peer.anyIpv4(),
            ec2.Port.tcp(80),
            'Allow HTTP from anywhere'
        );
        // Allow HTTPS access from anywhere
        securityGroup.addIngressRule(
            ec2.Peer.anyIpv4(),
            ec2.Port.tcp(443),
            'Allow HTTPS from anywhere'
        );

        // Allow access to your backend port (5500)
        securityGroup.addIngressRule(
            ec2.Peer.anyIpv4(),
            ec2.Port.tcp(5500),
            'Allow backend port from anywhere'
        );

        // Read the user data script from a separate file
        const userDataScript = fs.readFileSync(path.join(__dirname, '../scripts/user-data.sh'), 'utf8');
        const ubuntuAmi = new ec2.LookupMachineImage({
            name: 'ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*',
            owners: ['099720109477'], // Canonical's AWS account ID
        });

        // Create an EC2 instance using the free tier eligible t2.micro
        const instance = new ec2.Instance(this, 'MinimalInstance', {
            vpc,
            vpcSubnets: {
                subnetType: ec2.SubnetType.PUBLIC,
            },
            securityGroup,
            instanceType: ec2.InstanceType.of(
                ec2.InstanceClass.T2,
                ec2.InstanceSize.MICRO
            ),
            machineImage: ubuntuAmi,
            keyName: 'radiatorforge-keypair',
            userData: ec2.UserData.custom(userDataScript)
        });


        // Output the instance's public DNS
        new cdk.CfnOutput(this, 'InstancePublicDns', {
            value: instance.instancePublicDnsName,
            description: 'Public DNS of the EC2 instance',
        });

        // Output the instance's public IP
        new cdk.CfnOutput(this, 'InstancePublicIp', {
            value: instance.instancePublicIp,
            description: 'Public IP of the EC2 instance',
        });
    }
}
