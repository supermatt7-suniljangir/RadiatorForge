#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import {EC2Stack} from '../lib/ec2Stack';

const app = new cdk.App();

new EC2Stack(app, 'RadiatorForge', {
    env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION,
    },
});
